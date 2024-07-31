import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './schema/message.schema';
import { User } from 'src/user/schemas/user.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':storeId')
  async getChatHistory(@Param('storeId') storeId: string): Promise<Message[]> {
    return this.chatService.getChatHistory(storeId);
  }

  @Get(':storeId/:userId/messages')
  async getMessages(
    @Param('storeId') storeId: string,
    @Param('userId') userId: string,
  ): Promise<Message[]> {
    return this.chatService.getMessages(storeId, userId);
  }
}
