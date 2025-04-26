import { Injectable, Logger } from '@nestjs/common';
import { TopicHandler } from './topic.handler';

@Injectable()
export class PaymentTopicHandler implements TopicHandler {
  private readonly logger = new Logger(PaymentTopicHandler.name);

  async processMessage(topic: string, message: string): Promise<void> {
    this.logger.log(`Processing Topic ${topic} ==> message: ${message}`);
  }
}