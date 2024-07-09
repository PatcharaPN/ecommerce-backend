import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/products.schemas';
import { Model } from 'mongoose';
import { Store, StoreDocument } from 'src/store/schemas/store.schemas';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    await createdProduct.save();

    const store = await this.storeModel.findById(createProductDto.store);
    if (!store) {
      throw new Error('Store not found');
    }

    store.products.push(createdProduct);
    await store.save();

    return createdProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().populate('store').exec();
  }

  findOne(id: string): Promise<Product | null> {
    return this.productModel.findById(id).populate('store').exec();
  }

  update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | null> {
    return this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('store')
      .exec();
  }
}
