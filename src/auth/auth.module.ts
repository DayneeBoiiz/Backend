import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Strategy_42 } from './utils/42.strategy';
import { SessionSerializer } from './utils/Serializer';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [
    AuthService,
    Strategy_42,
    SessionSerializer,
    {
      provide: 'FortyTwoStrategy',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
