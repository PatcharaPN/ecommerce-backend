import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/products.schemas';
import { Model } from 'mongoose';
import { Store, StoreDocument } from 'src/store/schemas/store.schemas';
import {
  Category,
  CategoryDocument,
} from 'src/category/Schema/Category.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    await createdProduct.save();

    const store = await this.storeModel.findById(createProductDto.store);
    const category = await this.categoryModel.findById(
      createProductDto.category,
    );

    if (!store) {
      throw new Error('Store not found');
    }
    if (!category) {
      throw new Error('Category not found');
    }

    store.products.push(createdProduct);
    await store.save();

    return this.productModel
      .findById(createdProduct._id)
      .populate('store')
      .populate('category')
      .exec();
  }
  findOne(id: string): Promise<Product | null> {
    return this.productModel.findById(id).populate('store').exec();
  }
  findAll() {
    return this.productModel.find().populate('store').populate('category');
  }
  update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | null> {
    return this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('store')
      .populate('category')
      .exec();
  }
  async deleteById(id: string): Promise<{ message: string }> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Products with id ${id} not found`);
    }
    return { message: 'Product Deleted' };
  }
}
