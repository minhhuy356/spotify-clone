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
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    const access_token = authHeader.split(' ')[1];

    const verifyLink = `${this.configService.get<string>('ENDPOINT_VERIFY_EMAIL')}${access_token}`;

    await this.mailerService.sendMail({
      to: email,
      from: '"Support Team" <support@example.com>',
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'verify_email',
      context: {
        VERIFY_LINK: verifyLink,
        EMAIL: email,
      },
    });
  }
}
