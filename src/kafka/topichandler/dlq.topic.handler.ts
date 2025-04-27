import { Injectable, Logger } from '@nestjs/common';
import { TopicHandler } from './topic.handler';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DLQTopicHandler implements TopicHandler {
  private readonly logger = new Logger(DLQTopicHandler.name);

  constructor(private readonly config: ConfigService) {}

  processMessage(topic: string, message: string): Promise<void> {
    this.logger.log(
      `Processing DQL from topic==> ${topic} ==> message: ${message}`,
    );
    return Promise.resolve();
  }
}
