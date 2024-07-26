import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StoresService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() createStoreDto: CreateStoreDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createStoreDto.storeimg = `http://localhost:3000/uploads/${file.filename}`;
    }
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
