import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  avatar?: string;

  age?: number;

  city?: string;

  university?: string;
}
