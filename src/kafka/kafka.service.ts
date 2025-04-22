import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka = new Kafka({
    clientId: 'nestjs-app',
    brokers: ['localhost:9092'], // Replace with your Kafka broker(s)
  });

  private producer: Producer = this.kafka.producer();
  private consumer: Consumer = this.kafka.consumer({ groupId: 'nestjs-group' });

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    console.log('Kafka connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    console.log('Kafka disconnected');
  }

  async sendMessage(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }

  async consumeMessages(topic: string, callback: (message: string) => void) {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        callback(message.value?.toString() || '');
      },
    });
  }
}