import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, AuthDtoLogin } from './dto';
import * as argon from 'argon2';
import { UserDetails } from './utils/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async findUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async ValidateUser(details: UserDetails) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: details.email,
      },
    });

    if (!user) {
      const Newuser = await this.prisma.user.create({
        data: {
          email: details.email,
          NickName: details.login,
          firstName: details.firstname,
          LastName: details.lastname,
          hash: '',
        },
      });
      const ret = await this.signToken(Newuser.id, Newuser.email);
      return ret;
    }

    const ret = await this.signToken(user.id, user.email);
    return ret;
  }

  async signin(dto: AuthDtoLogin) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) {
      throw new UnauthorizedException('Incorrect password');
    }

    return user;
  }

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          firstName: dto.FirstName,
          NickName: dto.NickName,
          LastName: dto.LastName,
        },
      });

      return user;
    } catch (error) {
      if (error.code == 'P2002') {
        throw new ConflictException('Credentials taken');
      }
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const ret = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });

    return {
      access_token: ret,
    };
  }
}
