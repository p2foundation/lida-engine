import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { SmsDto } from './dto/sms.dto';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
    private logger = new Logger('SmsController');

    constructor(
        private smsService: SmsService,
        private httpService: HttpService
    ) { }

    @Post('sendsms')
    public async sendSms(
        @Body() transDto: SmsDto
    ) {
        const s2 = await this.smsService.SendSMS(transDto);
        return s2
    }

    @Post('bulk')
    public async sendBulkSms(
        @Body() transDto: SmsDto
    ): Promise<any> {
        const sbs = await this.smsService.postBulkSMS(transDto);
        return sbs;
    }

}
