import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthDtoLogin } from './dto';
import { AuthenticatedGuard } from './utils/authenticated.guard';
import { FortyTwoAuthGuard } from './utils/Guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dtologin: AuthDtoLogin) {
    return this.authService.signin(dtologin);
  }

  @Get('/42/login')
  @UseGuards(FortyTwoAuthGuard)
  @UseGuards(AuthenticatedGuard)
  handlLogin() {
    return { msg: 'Hello World' };
  }

  @Get('/42/callback')
  @UseGuards(FortyTwoAuthGuard)
  @UseGuards(AuthenticatedGuard)
  handRedirect() {
    return { msg: 'OK' };
  }
}
