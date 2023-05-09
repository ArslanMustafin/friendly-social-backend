import { Injectable } from '@nestjs/common';
import { UserService } from 'src/core/user/user.service';

import { sign } from 'jsonwebtoken';
import { PayloadType } from './types';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signPayload(payload: PayloadType) {
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

    const user = await this.userService.findByEmail(payload.email);
    user.token = token;
    await user.save();

    return token;
  }

  async validateUser(payload: PayloadType) {
    return await this.userService.findByEmail(payload.email);
  }
}
