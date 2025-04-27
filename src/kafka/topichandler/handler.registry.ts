import { Injectable, Logger } from '@nestjs/common';
import { TopicHandler } from './topic.handler';
import { PaymentTopicHandler } from './payment.topic.handler';
import { ConfigService } from '@nestjs/config';
import { DLQTopicHandler } from './dlq.topic.handler';

@Injectable()
export class HandlerRegistry {
  private handlers: Map<string, TopicHandler>;
  private readonly logger = new Logger(HandlerRegistry.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentHandler: PaymentTopicHandler,
    private readonly dqlHandler: DLQTopicHandler,
  ) {
    this.logger.log('Initializing KafkaHandlerRegistry');
    this.handlers = new Map<string, TopicHandler>();
    this.registerHandler();
    this.logAllHandler();
  }

  private registerHandler() {
    const topic = this.configService.get<string>('KAFKA_TOPIC_PAYMENT') || '';
    const dlqtopic = this.configService.get<string>('KAFKA_DLQ_TOPIC') || '';
    this.handlers.set(topic, this.paymentHandler);
    this.handlers.set(dlqtopic, this.dqlHandler);
  }

  getHandler(topic: string): TopicHandler | undefined {
    return this.handlers.get(topic);
  }

  private logAllHandler() {
    this.handlers.forEach((handler, topic) => {
      this.logger.log(
        `Handler registered for topic: ${topic} with handler ==> ${handler.constructor.name}`,
      );
    });
  }
}
