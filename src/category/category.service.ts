import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './Schema/Category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    console.log('Create Category DTO:', createCategoryDto);
    const createdCategory = await this.categoryModel.create(createCategoryDto);
    console.log('Created Category:', createdCategory);
    return createdCategory.save();
  }
  findAll() {
    return this.categoryModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
