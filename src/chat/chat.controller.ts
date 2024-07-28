import { Controller, Get, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schema/message.schema';

@Controller('chat')
export class ChatController {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  @Get(':storeId')
  async getChatHistory(@Param('storeId') storeId: string) {
    return this.messageModel.find({ store: storeId }).exec();
  }
}
