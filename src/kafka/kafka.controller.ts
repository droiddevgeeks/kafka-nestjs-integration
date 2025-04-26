import { Controller, Post, Query } from '@nestjs/common';
import { KafkaProducerService } from './kafka.producer';

@Controller()
export class KafkaController {
  constructor(private readonly kafkaService: KafkaProducerService) {}

  @Post('publish')
  async sendMessage(
    @Query('topic') topic: string,
    @Query('message') message: string,
  ) {
    await this.kafkaService.sendMessage(topic, message);
    return 'Message sent';
  }
}
