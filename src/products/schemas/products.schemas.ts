import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from 'src/category/Schema/Category.schema';
import { Store } from 'src/store/schemas/store.schemas';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  rating: number;

  @Prop()
  quantity: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Store' })
  store: Store;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
