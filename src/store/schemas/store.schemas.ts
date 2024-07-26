import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/products/schemas/products.schemas';
import { User } from 'src/user/schemas/user.schema';

export type StoreDocument = Store & Document;

@Schema({ timestamps: true })
export class Store {
  @Prop({ required: true })
  name: string;

  @Prop()
  location: string;

  @Prop()
  following: number;

  @Prop()
  like: number;

  @Prop()
  description: string;

  @Prop()
  storeimg: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  products: Product[];
}

export const StoreSchema = SchemaFactory.createForClass(Store);
