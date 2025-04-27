import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from './kafka.config';

@Injectable()
export class DLQConsumerService implements OnModuleInit {
  private readonly logger = new Logger(DLQConsumerService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaConfig: KafkaConfig
  ) {}

  async onModuleInit() {
    await this.kafkaConfig.connectConsumer();
    await this.subscribeKafkaDLQConsumerTopic();
    this.logger.log('DQL Consumer connected, subscribed to topics');
  }

  private async subscribeKafkaDLQConsumerTopic() {
    this.logger.log('Subscribing to Kafka DLQ topics');
    const topics =
      this.configService.get<string>('KAFKA_DLQ_TOPIC')?.split(',') || [];
    await this.kafkaConfig
      .getConsumer()
      .subscribe({ topics, fromBeginning: false });
    this.logger.log(`Subscribed to DLQ topic: ${topics.join(',')}`);
  }
}
