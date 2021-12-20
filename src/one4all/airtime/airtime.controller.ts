import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AirtimeService } from './airtime.service';
import { TopupDto } from './dto/topup.dto';
import { TransStatusDto } from './dto/transtatus.dto';

@Controller('airtime')
export class AirtimeController {
  private logger = new Logger('AirtimeController');

  constructor(private airtimeService: AirtimeService) {}

  @Get('testopup')
  testAirtime(): string {
    return `Airtime topup processor started ...`;
  }

  @Post('/transtatus')
  public async queryTransactionstatus(
    @Body() qtsDto: TransStatusDto,
  ): Promise<any> {
    this.logger.log(`transtatus dto => ${JSON.stringify(qtsDto)}`);
    const ts = await this.airtimeService.transactionStatus(qtsDto);
    return ts;
  }

  @Post('/topup')
  public async processTopup(@Body() ptDto: TopupDto): Promise<any> {
    this.logger.log(`topup airtime dto => ${JSON.stringify(ptDto)}`);
    const ta = await this.airtimeService.topupAirtime(ptDto);
    return ta;
  }
}
