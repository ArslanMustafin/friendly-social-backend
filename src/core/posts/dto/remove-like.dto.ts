import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveLikeDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
