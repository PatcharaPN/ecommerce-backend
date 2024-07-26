import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Store } from 'src/store/schemas/store.schemas';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  username: string;

  @Prop({ default: null })
  userImage: string;

  @Prop({ type: Types.ObjectId, ref: 'Store', default: null })
  store: Types.ObjectId;

  @Prop()
  role: 'merchant' | 'customer';
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
