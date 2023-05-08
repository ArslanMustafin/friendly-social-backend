import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
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

  @ApiProperty({
    default: 'Иван',
  })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    default: 'Иванович',
  })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  middlename?: string;
}
