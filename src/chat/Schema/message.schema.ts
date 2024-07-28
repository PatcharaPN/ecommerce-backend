import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type MessageSchema = Message & Document;
@Schema()
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  sender: string;

  @Prop({ type: Types.ObjectId, ref: 'Store' })
  store: string;

  @Prop()
  content: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
