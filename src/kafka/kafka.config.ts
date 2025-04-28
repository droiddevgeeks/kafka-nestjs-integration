import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, Producer } from 'kafkajs';

@Injectable()
export class KafkaConfig {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private txnProducer: Producer | null = null;
  private consumer: Consumer | null = null;

  private readonly logger = new Logger(KafkaConfig.name);
  constructor(private readonly configService: ConfigService) {}

  private getKafkaClient() {
    const kafkaEnable=  this.configService.get<boolean>('KAFKA_FLOW_ENABLE');
    this.logger.log(`Kafka flow enable: ${kafkaEnable}`);
    if (!this.kafka && kafkaEnable) {
      this.kafka = new Kafka({
        clientId: this.configService.get<string>('KAFKA_CLIENT_ID'),
        brokers:
          this.configService.get<string>('KAFKA_BROKER')?.split(',') || [],
      });
    }
    return this.kafka;
  }

  public getProducer(): Producer | null {
    const client = this.getKafkaClient();
    if (!this.producer && client) {
      this.logger.log('Creating Kafka producer');
      this.producer = client.producer();
    }
    return this.producer;
  }

  public getTxnProducer(): Producer | null {
    const client = this.getKafkaClient();
    if (!this.txnProducer && client) {
      this.logger.log('Creating transactional Kafka producer');
      this.txnProducer = client.producer({
        transactionalId: 'transactional-producer',
        maxInFlightRequests: 1,
      });
    }
    return this.txnProducer;
  }

  public getConsumer(): Consumer | null {
    const client = this.getKafkaClient();
    if (!this.consumer && client) {
      this.logger.log('Creating Kafka consumer');
      this.consumer = client.consumer({
        groupId:
          this.configService.get<string>('KAFKA_CONSUMER_GROUP_ID') ||
          'nestjs-group',
        maxBytes: 10485760,
        maxBytesPerPartition: 10485760,
      });
    }
    return this.consumer;
  }

  async connectProducer() {
    const producer = this.getProducer();
    if (producer) {
      await producer.connect();
      console.log('Producer connected');
    }
  }

  async connectTransactionalProducer() {
    const txnProducer = this.getTxnProducer();
    if (txnProducer) {
      await txnProducer.connect();
      this.logger.log('Transactional producer connected');
    }
  }

  async connectConsumer() {
    const consumer = this.getConsumer();
    if (consumer) {
      await consumer.connect();
      console.log('Consumer connected');
    }
  }

  async disconnectProducer() {
    if (this.producer) {
      await this.producer.disconnect();
      console.log('Producer disconnected');
    }
  }

  async disconnectTransactionalProducer() {
    if (this.txnProducer) {
      await this.txnProducer.disconnect();
      this.logger.log('Transactional producer disconnected');
    }
  }

  async disconnectConsumer() {
    if (this.consumer) {
      await this.consumer.disconnect();
      console.log('Consumer disconnected');
    }
  }
}
