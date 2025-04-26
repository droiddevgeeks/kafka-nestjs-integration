import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kakfa.module';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule,
    RouterModule.register([
      {
        path: 'kafka',
        module: KafkaModule,
      },
    ])
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
