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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AddToFriendsDto } from './dto/add-to-freinds.dto';
import { RemoveFriendDto } from './dto/remove-freind.dto';
import { ALLOWED_MIME_TYPES, FileValidationErrors } from 'src/utils/configs/multer';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user._id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('friend')
  addToFriend(@Body() addToFriendsDto: AddToFriendsDto) {
    return this.userService.addToFriends(addToFriendsDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('friend/remove')
  deleteToFriend(@Body() removeFriendDto: RemoveFriendDto) {
    return this.userService.removeFriend(removeFriendDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('avatar')
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
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (
      req.fileValidationError &&
      req.fileValidationError === FileValidationErrors.UNSUPPORTED_FILE_TYPE
    ) {
      throw new BadRequestException(
        `Разрешены картинки следующих форматов: ${ALLOWED_MIME_TYPES.toString()}`,
      );
    }
    return this.userService.uploadAvatar(req.user._id, file.path);
  }
}
