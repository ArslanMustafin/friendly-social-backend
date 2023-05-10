import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationErrors, ALLOWED_MIME_TYPES } from 'src/utils/configs/multer';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        text: {
          type: 'string',
          format: 'string',
        },
        authorId: {
          type: 'string',
          format: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() { text }: Omit<CreatePostDto, 'authorId'>,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (
      req.fileValidationError &&
      req.fileValidationError === FileValidationErrors.UNSUPPORTED_FILE_TYPE
    ) {
      throw new BadRequestException(
        `Разрешены картинки следующих форматов: ${ALLOWED_MIME_TYPES.toString()}`,
      );
    }

    return this.postsService.create({ text, authorId: req.user._id, image: file.path });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.postsService.findAll();
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  findByUser(@Req() req) {
    return this.postsService.findPostsForFriends(req.user._id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        text: {
          type: 'string',
          format: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (
      req.fileValidationError &&
      req.fileValidationError === FileValidationErrors.UNSUPPORTED_FILE_TYPE
    ) {
      throw new BadRequestException(
        `Разрешены картинки следующих форматов: ${ALLOWED_MIME_TYPES.toString()}`,
      );
    }
    return this.postsService.update(id, { ...updatePostDto, image: file.path });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Post(':postId/like')
  @UseGuards(AuthGuard('jwt'))
  async likePost(@Param('postId') postId: string, @Req() req) {
    const { _id } = req.user;

    return this.postsService.addLike(postId, _id);
  }

  @Delete(':postId/like')
  @UseGuards(AuthGuard('jwt'))
  async removeLikePost(@Param('postId') postId: string, @Req() req) {
    const { _id } = req.user;

    return this.postsService.removeLike(postId, _id);
  }
}
