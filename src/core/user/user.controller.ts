import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Res,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AddToFriendsDto } from './dto/add-to-freinds.dto';
import { RemoveFriendDto } from './dto/remove-freind.dto';
import { User } from './schemas/user.schema';
import { ALLOWED_MIME_TYPES, FileValidationErrors } from 'src/utils/configs/multer';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('friend')
  addToFriend(@Body() addToFriendsDto: AddToFriendsDto) {
    return this.userService.addToFriends(addToFriendsDto);
  }

  @Post('friend/remove')
  deleteToFriend(@Body() removeFriendDto: RemoveFriendDto) {
    return this.userService.removeFriend(removeFriendDto);
  }

  @Post(':id/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Param('id') userId: string,
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
    return this.userService.uploadAvatar(userId, file.path);
  }
}
