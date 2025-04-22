import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaService } from './kafka/kafka.service';

@Controller()
export class AppController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post('send')
  async sendMessage(@Query('topic') topic: string, @Query('message') message: string) {
    await this.kafkaService.sendMessage(topic, message);
    return 'Message sent';
  }

  @Get('consume')
  async consumeMessages(@Query('topic') topic: string) {
    this.kafkaService.consumeMessages(topic, (message) => {
      console.log(`Received message: ${message}`);
    });
    return 'Consuming messages';
  }
}
