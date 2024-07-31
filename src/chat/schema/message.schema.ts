import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type MessageDocument = Message & Document;
@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  sender: string;

  @Prop({ type: Types.ObjectId, ref: 'Store' })
  store: string;

  @Prop({ type: String, required: true })
  recipient: string;

  @Prop()
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
