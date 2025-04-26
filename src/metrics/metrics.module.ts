import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { Registry } from 'prom-client';

@Module({
  controllers: [MetricsController],
  providers: [
    MetricsService,
    {
      provide: Registry,
      useValue: new Registry(),
    },
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
