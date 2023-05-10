import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FilesController {
  @Get('avatars/:fileId')
  async serveAvatar(@Param('fileId') fileId: string, @Res() res) {
    res.sendFile(fileId, { root: 'files/avatars' });
  }

  @Get('posts/:fileId')
  async servePost(@Param('fileId') fileId: string, @Res() res) {
    res.sendFile(fileId, { root: 'files/posts' });
  }
}
