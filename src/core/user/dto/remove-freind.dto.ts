import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveFriendDto {
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
