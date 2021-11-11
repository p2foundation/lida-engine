import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AirtimeModule } from './one4all/airtime/airtime.module';
import { MerchantsModule } from './merchants/merchants.module';
import { BillpaymentsModule } from './one4all/billpayments/billpayments.module';
import { PayswitchModule } from './payswitch/payswitch.module';
import { EtranzactModule } from './etranzact/etranzact.module';
import { SmsModule } from './one4all/sms/sms.module';
import { MobilemoneyModule } from './one4all/mobilemoney/mobilemoney.module';

@Module({
  imports: [
    AuthModule, 
    AirtimeModule, 
    MerchantsModule, 
    BillpaymentsModule, 
    PayswitchModule, 
    EtranzactModule, SmsModule, MobilemoneyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
