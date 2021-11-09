import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AirtimeModule } from './airtime/airtime.module';
import { MerchantsModule } from './merchants/merchants.module';
import { BillpaymentsModule } from './billpayments/billpayments.module';
import { PayswitchModule } from './payswitch/payswitch.module';
import { EtranzactModule } from './etranzact/etranzact.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    AuthModule, 
    AirtimeModule, 
    MerchantsModule, 
    BillpaymentsModule, 
    PayswitchModule, 
    EtranzactModule, SmsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
