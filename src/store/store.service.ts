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

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const user = await this.userModel.findById(createStoreDto.owner);
    if (!user) {
      throw new Error('User objectId not found');
    }

    const createdStore = new this.storeModel(createStoreDto);
    createdStore.owner = user._id as Types.ObjectId;

    const savedStore = await createdStore.save();

    user.store = savedStore._id as Types.ObjectId;
    await user.save();

    const updatedUser = await this.userModel
      .findById(user._id)
      .populate('store')
      .exec();

    return savedStore;
  }

  async findAll(): Promise<Store[]> {
    return this.storeModel.find().exec();
  }

  async findOne(id: string): Promise<Store | null> {
    return this.storeModel.findById(id).exec();
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
