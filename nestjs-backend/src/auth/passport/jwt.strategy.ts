import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { KeyService } from '../key/key.service';
import { IUser } from '@/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    keyService: KeyService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: keyService.getPrivateKey(),
    });
  }

  async validate(user: IUser) {
    const { _id, email, roles, address, date, gender, imgUrl, phoneNumber } =
      user;
    return {
      _id,
      email,
      roles,
    };
  }
}
