import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

import { diskStorage } from 'multer';
import { extname } from 'path';

export enum FileValidationErrors {
  UNSUPPORTED_FILE_TYPE = 'UNSUPPORTED_FILE_TYPE',
}

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const getBaseConfig: (path: string) => MulterOptions = (path) => ({
  storage: diskStorage({
    destination: path,
    filename: (_req, file, cb) => {
      const uniqueFileName = `${new Date().getTime()}${extname(file.originalname)}`;

      return cb(null, uniqueFileName);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, // максимальный размер файла (2 Мб)
  },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      _req.fileValidationError = FileValidationErrors.UNSUPPORTED_FILE_TYPE;

      callback(null, false);
    } else {
      callback(null, true);
    }
  },
});

export const avatarsMulterConfig: MulterOptions = {
  ...getBaseConfig('./files/avatars'),
};

export const postsMulterConfig: MulterOptions = {
  ...getBaseConfig('./files/posts'),
};
