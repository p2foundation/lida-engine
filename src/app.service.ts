import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Lidapay @2022 restful api running ...`;
  }
}
