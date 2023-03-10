import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy as FortyTwoStrategy } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class Strategy_42 extends PassportStrategy(FortyTwoStrategy) {
  constructor(
    @Inject('FortyTwoStrategy') private readonly authService: AuthService,
  ) {
    super({
      clientID:
        'u-s4t2ud-d2112c97d0018f46d03062961f3d5025d67573714305341012ae2441aa8237e0',
      clientSecret:
        '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',
      callbackURL: 'http://10.30.109.86:3000/auth/42/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(profile);

    // const result: UserDetails = JSON.parse(profile._json);
    // console.log(result);

    const user = await this.authService.ValidateUser({
      email: profile._json.email,
      login: profile._json.login,
      firstname: profile._json.first_name,
      lastname: profile._json.last_name,
    });
  }
}
