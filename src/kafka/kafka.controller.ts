import { Body, Controller, Post, Query } from '@nestjs/common';
import { KafkaProducerService } from './kafka.producer';

@Controller()
export class KafkaController {
  constructor(private readonly kafkaService: KafkaProducerService) {}

  @Post('publish')
  async sendMessage(@Body() body: { topic: string; message: string }) {
    const { topic, message } = body;
    await this.kafkaService.sendMessage(topic, message);
    return 'Message sent';
  }

  @Post('txn/publish')
  async sendTransactionMessage(
    @Body() body: { topic: string; message: string },
  ) {
    const { topic, message } = body;
    const record = {
      topic: topic,
      messages: [{ value: JSON.stringify(message) }],
    };
    try {
      await this.kafkaService.sendMessageWithTransaction(record);
      return { status: 'success', message: 'Message sent with transaction' };
    } catch (error) {
      return {
        status: 'error',
        message: 'Transaction failed, message not sent',
        error: error.message,
      };
    }
  }
}
