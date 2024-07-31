import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateStoreDto } from './dto/create-store.dto';
import { Store, StoreDocument } from './schemas/store.schemas';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<StoreDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<any> {
    const user = await this.userModel.findById(createStoreDto.owner);
    if (!user) {
      throw new NotFoundException('User objectId not found');
    }

    const createdStore = new this.storeModel(createStoreDto);
    createdStore.owner = user._id as Types.ObjectId;

    const savedStore = await createdStore.save();

    user.store = savedStore._id as Types.ObjectId;
    await user.save();

    const populatedStore = await this.storeModel
      .findById(savedStore._id)
      .populate('owner')
      .exec();

    const response = {
      _id: populatedStore._id,
      name: populatedStore.name,
      location: populatedStore.location,
      owner: populatedStore.owner,
      storeimg: populatedStore.storeimg,
      description: populatedStore.description,
      products: populatedStore.products,
      __v: populatedStore.__v,
    };

    return response;
  }

  async findAll(): Promise<Store[]> {
    return this.storeModel.find().exec();
  }

  async findOne(storeId: string): Promise<Store | null> {
    return this.storeModel.findById(storeId).exec();
  }

  async likeStore(id: string): Promise<Store> {
    const store = await this.storeModel.findById(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    store.like++;
    await store.save();
    return store;
  }

  async followStore(id: string): Promise<Store> {
    const store = await this.storeModel.findById(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    store.following++;
    await store.save();
    return store;
  }
}
