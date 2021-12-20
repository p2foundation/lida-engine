import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AirtimeModule } from './one4all/airtime/airtime.module';
import { MerchantsModule } from './merchants/merchants.module';
import { EtranzactModule } from './etranzact/etranzact.module';
import { SmsModule } from './one4all/sms/sms.module';
import { MobilemoneyModule } from './one4all/mobilemoney/mobilemoney.module';
import { PsmobilemoneyModule } from './payswitch/psmobilemoney/psmobilemoney.module';
import { PscardpaymentModule } from './payswitch/pscardpayment/pscardpayment.module';
import { BillpaymentsModule } from './one4all/billpayments/billpayments.module';

@Module({
  imports: [
    AuthModule,
    AirtimeModule,
    MerchantsModule,
    BillpaymentsModule,
    EtranzactModule,
    SmsModule,
    MobilemoneyModule,
    PsmobilemoneyModule,
    PscardpaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
