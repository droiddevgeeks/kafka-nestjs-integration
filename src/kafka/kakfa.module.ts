import { Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka.producer';
import { KafkaController } from './kafka.controller';
import { KafkaConfig } from './kafka.config';
import { ConfigModule } from '@nestjs/config';
import { HandlerRegistry } from './topichandler/handler.registry';
import { PaymentTopicHandler } from './topichandler/payment.topic.handler';
import { KafkaConsumerService } from './kafka.consumer';

@Module({
  imports: [ConfigModule],
  controllers: [KafkaController],
  providers: [
    KafkaConfig,
    KafkaProducerService,
    KafkaConsumerService,
    PaymentTopicHandler,
    HandlerRegistry,
  ],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
