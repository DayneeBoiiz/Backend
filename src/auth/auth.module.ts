import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Strategy_42 } from './utils/42.strategy';
import { SessionSerializer } from './utils/Serializer';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60s' },
    }),
  ],
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
