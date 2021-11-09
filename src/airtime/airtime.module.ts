import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AirtimeController } from './airtime.controller';
import { AirtimeService } from './airtime.service';

@Module({
  imports: [HttpModule],
  controllers: [AirtimeController],
  providers: [AirtimeService]
})
export class AirtimeModule {}
