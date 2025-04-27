import { Injectable, Logger } from '@nestjs/common';
import { TopicHandler } from './topic.handler';

@Injectable()
export class PaymentTopicHandler implements TopicHandler {
  private readonly logger = new Logger(PaymentTopicHandler.name);

  processMessage(topic: string, message: string): Promise<void> {
    this.logger.log(`Processing Topic ${topic} ==> message: ${message}`);
    if (message.includes('fail')) {
      throw new Error('Simulated processing failure');
    }
    return Promise.resolve();
  }
}
