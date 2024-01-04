import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async register(email: string, password: string, nickName: string) {
    const existingUser = await this.findByEmail(email);
    const existingNickName = await this.findByNickName(nickName);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }
    if (existingNickName) {
      throw new ConflictException(
        '이미 해당 닉네임으로 가입된 사용자가 있습니다!',
      );
    }
    if (password.length < 6) {
      throw new UnauthorizedException('비밀번호는 6자리 이상이어야합니다.');
    }

    const hashedPassword = await hash(password, 10);
    await this.userRepository.save({
      email,
      password: hashedPassword,
      nickName,
    });
  }

  // 로그인
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });
    console.log(user);
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    const passwordConfirm = await compare(password, user.password);
    if (!passwordConfirm) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findByNickName(nickName: string) {
    return await this.userRepository.findOneBy({ nickName });
  }
}
