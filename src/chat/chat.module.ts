import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { Message, MessageSchema } from './Schema/message.schema';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
