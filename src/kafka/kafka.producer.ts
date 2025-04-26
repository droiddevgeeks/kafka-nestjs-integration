import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { KafkaConfig } from './kafka.config';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  constructor(
    private readonly kafkaConfig: KafkaConfig,
    private readonly metricsService: MetricsService,
  ) {}

  async onModuleInit() {
    await this.kafkaConfig.connectProducer();
    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy() {
    await this.kafkaConfig.disconnectProducer();
    this.logger.log('Kafka Producer disconnected');
  }

  async sendMessage(topic: string, message: string) {
    await this.kafkaConfig.getProducer().send({
      topic,
      messages: [{ value: message }],
    });
    this.logger.log(
      `Message sent to topic ${topic} with message: ${JSON.stringify(message)}`,
    );

    this.metricsService.incrementKafkaMessageProduced();
  }
}
