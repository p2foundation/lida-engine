import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ReceiveMoneyDto } from './dto/receive.money.dto';
import { MobilemoneyService } from './mobilemoney.service';

@Controller('mobilemoney')
export class MobilemoneyController {
    private logger = new Logger('MobilemoneyController');

    constructor(
        private mobilemoneyService: MobilemoneyService
    ){ }

    @Post('send')
    public async creditWallet(){
        return 'send mobile money'
    }

    @Post('receive')
    public async debitWallet(
        @Body() transDto: ReceiveMoneyDto
    ): Promise<any>{
        const dw = await this.mobilemoneyService.receiveMobileMoney(transDto);
        return dw;
    }
}
