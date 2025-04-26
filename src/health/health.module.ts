import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { KafkaModule } from 'src/kafka/kakfa.module';
import { KafkaHealthIndicator } from './kafka.health';

@Module({
  imports: [TerminusModule, KafkaModule],
  controllers: [HealthController],
  providers: [KafkaHealthIndicator],
})
export class HealthModule {}
