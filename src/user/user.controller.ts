import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body() loginUserDTO: LoginUserDto) {
    return await this.userService.login(loginUserDTO);
  }

  @Post('/signup')
  async createUser(@Body() createUserDTO: CreateUserDto) {
    return await this.userService.create(createUserDTO);
  }

  @Get('/check')
  checkUser(@Req() req: any) {
    const userPayload = req.user;
    return this.userService.checkUser(userPayload);
  }
}
