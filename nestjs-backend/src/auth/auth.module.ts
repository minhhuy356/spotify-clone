import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import { KeyService } from './key/key.service';
import ms from 'ms';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import { Algorithm } from 'jsonwebtoken';
import { UserActivitysModule } from '@/user_activity/user-activity.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    UserActivitysModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
        keyService: KeyService,
      ) => ({
        privateKey: keyService.getPrivateKey(),
        publicKey: keyService.getPublicKey(),
        signOptions: {
          algorithm: configService.get<string>(
            'JWT_ACCESS_ALGORITHM',
          ) as Algorithm,
          expiresIn:
            ms(configService.get<string>('JWT_ACCESS_EXPRIRE') || '1h') / 1000,
        },
      }),
      inject: [ConfigService, KeyService],
      extraProviders: [KeyService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, KeyService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
