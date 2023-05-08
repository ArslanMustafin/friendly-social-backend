import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class AddToFriendsDto {
  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  friendId: string;
}
