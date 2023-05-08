import { IsNotEmpty } from 'class-validator';

export class AddToFriendsDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  avatar: string;
}
