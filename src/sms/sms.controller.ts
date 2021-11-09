import { Controller, Logger } from '@nestjs/common';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
    private logger = new Logger('SmsController');

    constructor(
        private smsService: SmsService
    ){}

}
