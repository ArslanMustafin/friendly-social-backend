import { UpdatePostDto } from './../posts/dto/update-post.dto';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

import { AddToFriendsDto } from './dto/add-to-freinds.dto';
import { RemoveFriendDto } from './dto/remove-freind.dto';
import { LoginUserDto } from './dto/login-user.dto';

import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(registerUserDto: RegisterUserDto) {
    const existingUser = await this.userModel.findOne({ email: registerUserDto.email }).exec();

    if (existingUser) {
      throw new BadRequestException('Пользователь c таким email уже существует!');
    }

    const createdUser = new this.userModel(registerUserDto);

    return createdUser.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) throw new NotFoundException('Пользователь на найден!');

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);

    return user.save();
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.userModel.deleteOne({ _id: id }).exec();
  }

  async addToFriends({ userId, friendId }: AddToFriendsDto) {
    const user = await this.findOne(userId);
    const friend = await this.findOne(friendId);

    if (this.checkIsFriend(user, friend)) {
      throw new BadRequestException('Вы уже друзья!');
    }

    user.friends.push(friend);
    friend.friends.push(user);

    await Promise.all([user.save(), friend.save()]);

    return user;
  }

  async removeFriend({ userId, friendId }: RemoveFriendDto) {
    const user = await this.findOne(userId);
    const friend = await this.findOne(friendId);

    if (!this.checkIsFriend(user, friend)) {
      throw new BadRequestException('У вас нет в друзьях такого пользователя!');
    }

    user.friends = user.friends.filter((item) => item._id.toString() !== friend._id.toString());
    friend.friends = friend.friends.filter((item) => item._id.toString() !== user._id.toString());

    await Promise.all([user.save(), friend.save()]);

    return user;
  }

  async uploadAvatar(userId: string, file: string) {
    const user = await this.findOne(userId);

    if (user.avatar) {
      const oldPath = path.resolve(user.avatar);

      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, (err) => {
          if (err) throw new BadGatewayException('Что-то пошло не так');
        });
      }
    }

    return this.update(userId, { avatar: file });
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.findByEmail(email);

    if (!user) throw new NotFoundException('Пользователь c таким email на найден!');

    const isComparePassword = await bcrypt.compare(password, user.password);

    if (!isComparePassword) {
      throw new BadRequestException('Неправильный пароль');
    }

    return user;
  }

  private checkIsFriend(user: User, potentialFriend: User): boolean {
    return user.friends.some((friend) => friend._id.toString() === potentialFriend._id.toString());
  }
}
