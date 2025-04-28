import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from './kafka.config';
import { HandlerRegistry } from './topichandler/handler.registry';
import { MetricsService } from 'src/metrics/metrics.service';
import { TopicHandler } from './topichandler/topic.handler';
import { KafkaProducerService } from './kafka.producer';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private isConsumerConnected = false;
  private readonly maxRetries = 3;
  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaConfig: KafkaConfig,
    private readonly handlerRegistry: HandlerRegistry,
    private readonly metricsService: MetricsService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async onModuleInit() {
    await this.kafkaConfig.connectConsumer();
    await this.subscribeKafkaConsumerTopic();
    await this.processKafkaMessages();
    this.isConsumerConnected = true;
    this.logger.log('Consumer connected, subscribed to topics');
  }

  async onModuleDestroy() {
    await this.cleanup();
  }

  private async subscribeKafkaConsumerTopic() {
    this.logger.log('Subscribing to Kafka topics');
    const topics =
      this.configService.get<string>('KAFKA_TOPIC_PAYMENT')?.split(',') || [];

    const consumer = this.kafkaConfig.getConsumer();
    if (consumer) {
      await consumer.subscribe({ topics, fromBeginning: false });
      this.logger.log(`Subscribed to topic: ${topics.join(',')}`);
    }
  }

  private async processKafkaMessages() {
    try {
      const consumer = this.kafkaConfig.getConsumer();
      if (consumer) {
        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            this.metricsService.incrementKafkaMessageConsumed();
            const messageValue = message.value?.toString();
            this.logger.log(`Topic: ${topic} ==>Message value: ${messageValue}`);
            const handler = this.handlerRegistry.getHandler(topic);
            if (handler && messageValue) {
              try {
                await this.processwithRetry(handler, topic, messageValue);
              } catch (error) {
                this.logger.error(
                  `Message failed after retries. Sending to DLQ. Topic: ${topic}, Partition: ${partition}, Message: ${messageValue}`,
                );
                await this.sendToDLQ(
                  topic,
                  messageValue,
                  partition,
                  (error as Error).message || 'Unknown error',
                );
              }
            } else {
              this.logger.warn(`No handler found for topic ${topic}`);
            }
          },
        });
      }
    } catch (error) {
      this.logger.error('Error processing Kafka messages', error.message);
    }
  }

  private async processwithRetry(
    handler: TopicHandler,
    topic: string,
    messageValue: string,
  ) {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.log(`Retrying connection... Attempt ${attempt}`);
        await handler.processMessage(topic, messageValue);
        return;
      } catch (error) {
        attempt++;
        this.logger.warn(
          `Retrying message. Attempt ${attempt}/${this.maxRetries}. Topic: ${topic}, Message: ${messageValue}`,
        );
        if (attempt > this.maxRetries) {
          this.logger.error(
            `Max retries reached for topic ${topic}. Message: ${messageValue}`,
            error,
          );
          throw error;
        }
      }
    }
  }

  private async sendToDLQ(
    topic: string,
    messageValue: string,
    partition: number,
    error: string,
  ) {
    this.logger.warn(
      `Sending message to DLQ. Topic: ${topic}, Message: ${messageValue}`,
    );
    const dlqMessage = {
      originalTopic: topic,
      partition,
      messageValue,
      error,
      timestamp: new Date().toISOString(),
    };
    const dlqTopic = this.configService.get<string>('KAFKA_DLQ_TOPIC');
    if (!dlqTopic) {
      throw new Error(
        'KAFKA_DLQ_TOPIC is not defined in the environment variables',
      );
    }
    await this.kafkaProducer.sendMessage(dlqTopic, JSON.stringify(dlqMessage));
    this.logger.log(`Message sent to DLQ: ${JSON.stringify(dlqMessage)}`);
  }

  async isConnected(): Promise<boolean> {
    try {
      const consumer = this.kafkaConfig.getConsumer();
      if(consumer){
        await consumer.describeGroup();
        this.isConsumerConnected = true;
      }
    } catch (error) {
      console.error('Kafka connection check failed:', error);
      this.isConsumerConnected = false;
    }
    return this.isConsumerConnected;
  }

  private async cleanup() {
    if (this.isConsumerConnected) {
      try {
        await this.kafkaConfig.disconnectConsumer();
        this.isConsumerConnected = false;
        this.logger.log('Consumer disconnected successfully');
      } catch (error) {
        this.logger.error('Error during Kafka consumer cleanup', error.message);
      }
    }
  }
}
