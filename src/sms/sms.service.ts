import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
    private logger = new Logger('SmsService');

    constructor(
        private httpService: HttpService
    ){}

    getSendSMS(): any {

    }
    postSendSMS(): any {
        
    }
}
