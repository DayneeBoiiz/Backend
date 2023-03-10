import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, AuthDtoLogin } from './dto';
import * as argon from 'argon2';
import { UserDetails } from './utils/types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
      delete Newuser.hash;
      return Newuser;
    }
    return user;
  }

  async signin(dto: AuthDtoLogin) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Incorrect password');
    }

    delete user.hash;
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

      delete user.hash;
      return user;
    } catch (error) {
      if (error.code == 'P2002') {
        throw new ConflictException('Credentials taken');
      }
    }
  }
}
