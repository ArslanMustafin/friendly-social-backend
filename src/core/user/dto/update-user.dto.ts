import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  avatar?: string;

  age?: number;

  city?: string;

  university?: string;
}
