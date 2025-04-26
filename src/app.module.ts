import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kakfa.module';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule,
    HealthModule,
    RouterModule.register([
      {
        path: 'kafka',
        module: KafkaModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
