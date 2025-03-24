// key.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeyService {
  constructor(private configService: ConfigService) {}

  private getKey(keyName: string) {
    return fs.readFileSync(
      path.join(process.cwd(), this.configService.get<string>(keyName)),
      'utf8',
    );
  }

  getPrivateKey(): string {
    return this.getKey('JWT_ACCESS_PRIVATE_KEY');
  }

  getPublicKey(): string {
    return this.getKey('JWT_ACCESS_PUBLIC_KEY');
  }
}
