import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
