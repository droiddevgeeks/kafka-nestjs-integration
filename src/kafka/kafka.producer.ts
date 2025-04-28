import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { KafkaConfig } from './kafka.config';
import { MetricsService } from 'src/metrics/metrics.service';
import { ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  constructor(
    private readonly kafkaConfig: KafkaConfig,
    private readonly metricsService: MetricsService,
  ) {}

  async onModuleInit() {
    await this.kafkaConfig.connectProducer();
    await this.kafkaConfig.connectTransactionalProducer();
    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy() {
    await this.kafkaConfig.disconnectProducer();
    await this.kafkaConfig.disconnectTransactionalProducer();
    this.logger.log('Kafka Producer disconnected');
  }

  async sendMessage(topic: string, message: string) {
    const producer = this.kafkaConfig.getProducer();
    if(producer){
      await producer.send({
        topic,
        messages: [{ value: message }],
      });
      this.logger.log(
        `Message sent to topic ${topic} with message: ${JSON.stringify(message)}`,
      );
  
      this.metricsService.incrementKafkaMessageProduced();
    }
  }

  async sendMessageWithTransaction(record: ProducerRecord) {
    const producer = this.kafkaConfig.getProducer();
    if(producer){
      const transaction = await producer.transaction();
      try {
        this.logger.log(
          `Sending message with transaction: ${JSON.stringify(record)}`,
        );
        await transaction.send(record);
        await transaction.commit();
        this.logger.log('Transaction committed successfully');
      } catch (error) {
        this.logger.error('Transaction failed, aborting...', error.message);
        await transaction.abort();
        throw error;
      }
    }
  }
}
