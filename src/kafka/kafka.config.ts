import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, Producer } from 'kafkajs';

@Injectable()
export class KafkaConfig {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private consumer: Consumer | null = null;

  private readonly logger = new Logger(KafkaConfig.name);
  constructor(private readonly configService: ConfigService) {}

  private getKafkaClient() {
    if (!this.kafka) {
      this.kafka = new Kafka({
        clientId: this.configService.get<string>('KAFKA_CLIENT_ID'),
        brokers:
          this.configService.get<string>('KAFKA_BROKER')?.split(',') || [],
      });
    }
    return this.kafka;
  }

  public getProducer(): Producer {
    if (!this.producer) {
      this.logger.log('Creating Kafka producer');
      this.producer = this.getKafkaClient().producer();
    }
    return this.producer;
  }

  public getConsumer(): Consumer {
    if (!this.consumer) {
      this.logger.log('Creating Kafka consumer');
      this.consumer = this.getKafkaClient().consumer({
        groupId:
          this.configService.get<string>('KAFKA_CONSUMER_GROUP_ID') ||
          'nestjs-group',
      });
    }
    return this.consumer;
  }

  async connectProducer() {
    await this.getProducer().connect();
    console.log('Producer connected');
  }

  async connectConsumer() {
    await this.getConsumer().connect();
    console.log('Consumer connected');
  }

  async disconnectProducer() {
    if (this.producer) {
      await this.producer.disconnect();
      console.log('Producer disconnected');
    }
  }

  async disconnectConsumer() {
    if (this.consumer) {
      await this.consumer.disconnect();
      console.log('Consumer disconnected');
    }
  }
}
