import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getChatHistory(storeId: string): Promise<Message[]> {
    return this.messageModel
      .find({ store: storeId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async getMessages(storeId: string, userId: string): Promise<Message[]> {
    return this.messageModel
      .find({
        store: storeId,
        $or: [{ sender: userId }, { recipient: userId }],
      })
      .sort({ createdAt: 1 })
      .exec();
  }
}
