import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Put,
  Param,
  Res,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dto/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  async findbyId(@Param('userId') userId: string) {
    return this.userService.findById(userId);
  }
  @Post('register')
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
  async register(
    @Body() registerDTO: RegisterDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      registerDTO.userImage = `http://localhost:3000/uploads/${file.filename}`;
    }
    return this.userService.create(registerDTO);
  }
  @Put(':userId')
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
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.userImage = `http://localhost:3000/uploads/${file.filename}`;
    }
    try {
      const updatedUser = await this.userService.findByIdandUpdate(
        userId,
        updateUserDto,
      );
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return { user: updatedUser };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
