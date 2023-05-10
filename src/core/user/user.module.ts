import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './schemas/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { avatarsMulterConfig } from 'src/utils/configs/multer';

@Module({
  imports: [MulterModule.register(avatarsMulterConfig), MongooseModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
