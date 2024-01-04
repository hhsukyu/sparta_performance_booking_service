import { UserInfo } from 'src/utils/userInfo.decorator';

import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.register(
      createUserDto.email,
      createUserDto.password,
      createUserDto.nickName,
    );
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(
      loginUserDto.email,
      loginUserDto.password,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check')
  getEmail(@UserInfo() user: User) {
    return user;
  }
}
