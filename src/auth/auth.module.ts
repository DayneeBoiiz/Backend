import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Strategy_42 } from './utils/42.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, Strategy_42],
})
export class AuthModule {}
