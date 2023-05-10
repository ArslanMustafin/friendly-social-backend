import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    default: 'Lorem ipsum...',
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  image?: string; // Необязательное поле для изображения

  @IsNotEmpty()
  @IsString()
  authorId: string;
}
