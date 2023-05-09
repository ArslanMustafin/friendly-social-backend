import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { PayloadType } from './types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.userService.create(registerUserDto);

    const payload: PayloadType = {
      email: user.email,
    };
    const token = await this.authService.signPayload(payload);

    return { user, token };
  }

  @Post('login')
  async login(@Body() LoginUserDto: LoginUserDto) {
    const user = await this.userService.loginUser(LoginUserDto);

    const payload: PayloadType = {
      email: user.email,
    };

    const token = await this.authService.signPayload(payload);

    return { user, token };
  }
}
