import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { StoresService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  async findAll() {
    return this.storesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Put(':id/like')
  async likeStore(@Param('id') id: string) {
    return this.storesService.likeStore(id);
  }

  @Put(':id/follow')
  async followStore(@Param('id') id: string) {
    return this.storesService.followStore(id);
  }
}
