import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly kafkaMessageConsumed: Counter<string>;
  private readonly kafkaDLQMessageConsumed: Counter<string>;
  private readonly kafkaMessageProduced: Counter<string>;

  constructor(private readonly registry: Registry) {
    collectDefaultMetrics({ register: this.registry });
    this.kafkaMessageConsumed = new Counter({
      name: 'kafka_message_consumed',
      help: 'Number of messages consumed from Kafka',
      labelNames: ['topic'],
      registers: [this.registry],
    });
    this.kafkaDLQMessageConsumed = new Counter({
      name: 'kafka_dlq_message_consumed',
      help: 'Number of DLQ messages consumed from Kafka',
      labelNames: ['topic'],
      registers: [this.registry],
    });
    this.kafkaMessageProduced = new Counter({
      name: 'kafka_message_produced',
      help: 'Number of messages produced to Kafka',
      labelNames: ['topic'],
      registers: [this.registry],
    });
  }

  incrementKafkaMessageConsumed() {
    this.kafkaMessageConsumed.inc();
  }

  incrementKafkaDLQMessageConsumed() {
    this.kafkaDLQMessageConsumed.inc();
  }

  incrementKafkaMessageProduced() {
    this.kafkaMessageProduced.inc();
  }

  getMetrics() {
    return this.registry.metrics();
  }
}
