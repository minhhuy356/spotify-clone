import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage, User } from '@/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { IUser } from '@/users/users.interface';
import { AuthService } from '@/auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,
    private readonly authSerivce: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('send-verification')
  @ResponseMessage('Send email verification')
  async handleVerifyEmail(
    @Headers('authorization') authHeader: string,
    @Body('email') email: string,
  ) {
    // Kiểm tra header có token không
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    // Cắt chuỗi 'Bearer ' để lấy token
    const access_token = authHeader.split(' ')[1];

    const verifyLink = `${this.configService.get<string>('ENDPOINT_VERIFY_EMAIL')}${access_token}`;

    await this.mailerService.sendMail({
      to: email,
      from: '"Support Team" <support@example.com>',
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'verify_email', // Tên template email (không cần đuôi .hbs)
      context: {
        VERIFY_LINK: verifyLink, // Truyền biến VERIFY_LINK vào template
        EMAIL: email, // Truyền biến VERIFY_LINK vào template
      },
    });
  }
}
