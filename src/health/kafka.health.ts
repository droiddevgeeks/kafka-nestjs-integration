import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { KafkaConsumerService } from 'src/kafka/kafka.consumer';

@Injectable()
export class KafkaHealthIndicator {
  constructor(private readonly kafkaService: KafkaConsumerService) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isConnected = await this.kafkaService.isConnected();
    if (isConnected) {
      return {
        [key]: {
          status: 'up',
        },
      };
    }
    throw new Error(
      JSON.stringify({
        [key]: {
          status: 'down',
          message: 'Kafka connection is not healthy',
        },
      }),
    );
  }
}
