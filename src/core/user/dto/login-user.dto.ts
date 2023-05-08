import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    default: 'test@mail.ru',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    default: 'qwerty123',
  })
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
