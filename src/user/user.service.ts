import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema'; // Import UserDocument

import { RegisterDTO } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(registerDTO: RegisterDTO): Promise<User> {
    const newUser = new this.userModel(registerDTO);
    return await newUser.save();
  }
  async findByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email }).exec();
  }
  async findById(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    return await this.userModel.findById(id).exec();
  }
  async findByIdWithStore(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    return await this.userModel.findById(id).populate('store').exec();
  }
  async findByIdandUpdate(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }
}
