import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser, IUserToken } from '@/users/users.interface';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Algorithm } from 'jsonwebtoken';
import { Response } from 'express';
import { UserActivitysService } from '@/user_activity/user-activity.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private userActivityService: UserActivitysService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUserName(username);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isValid = await this.usersService.isValidPassword(
      pass,
      user.password,
    );

    if (isValid) {
      return user;
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, roles } = user;

    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      roles,
    };

    const refresh_token = await this.createRefreshToken({ email });

    //update user with refresh token
    await this.usersService.updateUserToken(refresh_token, _id);

    //set refresh_token as cookie
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Chỉ dùng secure trên HTTPS
      sameSite: 'lax', // Quan trọng nếu frontend & backend khác domain
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPRIRE')) * 1000,
    });

    const userActivity = await this.userActivityService.findById(
      _id.toString(),
    );

    const { tracks, artists, albums } = userActivity;

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: refresh_token,
      user: {
        _id,
        email,
        roles,
        tracks,
        artists,
        albums,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    return await this.usersService.register(createUserDto);
  }

  createRefreshToken = async (payload: any) => {
    const algorithm = this.configService.get<string>(
      'JWT_REFRESH_ALGORITHM',
    ) as Algorithm;

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_PRIVATE_KEY'), // Dùng secret cho HMAC
      algorithm: algorithm, // Có thể thay thế bằng HS384 hoặc HS512
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPRIRE')) / 1000,
    });

    return refresh_token;
  };

  processNewToken = async (refresh_token: string, response: Response) => {
    try {
      // Xác thực refresh token
      await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_PRIVATE_KEY'),
      });

      // Tìm user dựa vào refresh token hoặc email
      const user = await this.usersService.findUserByToken(refresh_token);

      console.log(refresh_token);

      if (user) {
        const { _id, name, email, roles } = user;

        const payload = {
          sub: 'token login',
          iss: 'from server',
          _id,
          email,
          roles,
        };

        const refresh_token = await this.createRefreshToken({ email });

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id.toString());

        //set refresh_token as cookie
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge:
            ms(this.configService.get<string>('JWT_REFRESH_EXPRIRE')) * 1000,
        });

        const userActivity = await this.userActivityService.findById(
          _id.toString(),
        );

        const { tracks, artists, albums } = userActivity;

        return {
          result: {
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: refresh_token,
            user: {
              _id,
              name,
              email,
              roles,
              tracks,
              artists,
              albums,
            },
          },
        };
      } else {
        throw new Error();
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Refresh token expired, please login again.',
        );
      } else {
        throw new BadRequestException('Invalid Refresh token. Please login');
      }
    }
  };

  logout = async (user: IUser, response: Response) => {
    try {
      if (user) {
        response.clearCookie('refresh_token', {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });

        await this.usersService.updateUserToken('', user._id);

        return 'ok';
      }
    } catch (error) {
      throw new BadRequestException('Invalid Access token!');
    }
  };

  getRefreshToken = async (refreshToken: string) => {
    try {
      if (!refreshToken) {
        throw new Error('Không tìm thấy refresh token!');
      }

      // Giải mã JWT mà không cần kiểm tra chữ ký
      const decoded = jwt.decode(refreshToken) as { exp: number } | null;

      return { refreshToken, decoded };
    } catch (error) {
      throw new BadRequestException('Verify email failed!');
    }
  };

  verifyEmail = async (accessToken: string) => {
    try {
      const user: IUserToken = await this.jwtService.decode(accessToken);

      const result = await this.usersService.verifyEmailById(user._id);

      if (!result) throw new Error();

      return `Verify email ${user.email} success`;
    } catch (error) {
      throw new BadRequestException('Verify email failed!');
    }
  };
}
