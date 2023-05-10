import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostModel } from './schemas/post.schema';
import { postsMulterConfig } from 'src/utils/configs/multer';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MulterModule.register(postsMulterConfig),
    MongooseModule.forFeature([PostModel]),
    UserModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
