import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/products.schemas';
import { Store, StoreSchema } from 'src/store/schemas/store.schemas';
import { Category, CategorySchema } from 'src/category/Schema/Category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],

  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
