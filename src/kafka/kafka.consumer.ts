import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from './kafka.config';
import { HandlerRegistry } from './topichandler/handler.registry';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaConfig: KafkaConfig,
    private readonly handlerRegistry: HandlerRegistry,
  ) {}

  async onModuleInit() {
    await this.kafkaConfig.connectConsumer();
    await this.subscribeKafkaConsumerTopic();
    await this.processKafkaMessages();
    this.logger.log('Consumer connected, subscribed to topics');
  }

  async onModuleDestroy() {
    this.kafkaConfig.disconnectConsumer();
    this.logger.log('Consumer disconnected');
  }

  private async subscribeKafkaConsumerTopic() {
    this.logger.log('Subscribing to Kafka topics');
    const topics =
      this.configService.get<string>('KAFKA_TOPIC_PAYMENT')?.split(',') || [];
    await this.kafkaConfig
      .getConsumer()
      .subscribe({ topics, fromBeginning: false });
    this.logger.log(`Subscribed to topic: ${topics}`);
  }

  private async processKafkaMessages() {
    try {
      await this.kafkaConfig.getConsumer().run({
        eachMessage: async ({ topic, partition, message }) => {
          const messageValue = message.value?.toString();
          this.logger.log(`Topic: ${topic} ==>Message value: ${messageValue}`);
          const handler = this.handlerRegistry.getHandler(topic);
          if (handler && messageValue) {
            await handler.processMessage(topic, messageValue);
          } else {
            this.logger.warn(`No handler found for topic ${topic}`);
          }
        },
      });
    } catch (error) {
      this.logger.error('Error processing Kafka messages', error.message);
    }
  }
}
