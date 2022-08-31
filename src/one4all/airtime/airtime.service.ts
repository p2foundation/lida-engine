import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import * as https from 'https';
import {
  ONE4ALL_APIKEY,
  ONE4ALL_APISECRET,
  ONE4ALL_BASEURL,
  ONE4ALL_RETAILER,
} from 'src/constants';
import { TransStatusDto } from './dto/transtatus.dto';
import { TopupDto } from './dto/topup.dto';
import { generateTransactionId } from 'src/utilities/utils';

@Injectable()
export class AirtimeService {
  private logger = new Logger('AirtimeService');
  private AirBaseUrl = ONE4ALL_BASEURL;

  constructor(private readonly httpService: HttpService) {}

  transactionStatus(
    transDto: TransStatusDto,
  ): Observable<AxiosResponse<TransStatusDto>> {
    const { transReference } = transDto;

    const payload = {
      trxn: transReference || '',
    };

    // https://tppgh.myone4all.com/api/TopUpApi/transactionStatus?trxn=1KNRUW111021

    const tsUrl =
      this.AirBaseUrl + `/TopUpApi/transactionStatus?trxn=${payload.trxn}`;

    const configs = {
      url: tsUrl,
      headers: { ApiKey: ONE4ALL_APIKEY, ApiSecret: ONE4ALL_APISECRET },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.logger.log(`transaction status payload == ${JSON.stringify(configs)}`);

    return this.httpService.get(configs.url, { httpsAgent: configs.agent, headers: configs.headers })
      .pipe(
        map((tsRes) => {
          this.logger.log(
            `Query TRANSACTION STATUS response ++++ ${JSON.stringify(tsRes)}`,
          );
          return tsRes.data;
        }),
        catchError((tsErrorRes) => {
          this.logger.error(
            `Query TRANSACTION STATUS ERROR response ---- ${JSON.stringify(
              tsErrorRes.response.data,
            )}`,
          );
       
          const tsErrorResMessage = tsErrorRes.response.data;
          throw new NotFoundException(tsErrorResMessage);   
        }),
      );
  }

  topupAirtime(transDto: TopupDto): Observable<AxiosResponse<TopupDto>> {
    const { retailer, recipientNumber, amount, network } = transDto;

    // const clientReference = generateTransactionId();
    const taParams = {
      retailer: ONE4ALL_RETAILER || retailer,
      network: '0' || network,
      recipient: recipientNumber || '',
      amount: amount || '',
      trxn: generateTransactionId() || '',
    };
    // const newTaParams = JSON.stringify(taParams);
    // https://tppgh.myone4all.com/api/TopUpApi/airtime?retailer=233241603241&recipient=233244588584&amount=1&network=0&trxn=1234567890

    const taUrl = `/TopUpApi/airtime?retailer=${taParams.retailer}&recipient=${taParams.recipient}&amount=${taParams.amount}&network=${taParams.network}&trxn=${taParams.trxn}`;

    const configs: any = {
      url: this.AirBaseUrl + taUrl,
      headers: { ApiKey: ONE4ALL_APIKEY, ApiSecret: ONE4ALL_APISECRET },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.logger.log(`Airtime topup payload == ${JSON.stringify(configs)}`);

    return this.httpService
      .get<any>(configs.url, {
        httpsAgent: configs.agent,
        headers: configs.headers,
      })
      .pipe(
        map((taRes) => {
          this.logger.verbose(
            `AIRTIME TOPUP response ++++ ${JSON.stringify(taRes.data)}`,
          );
          return taRes.data;
        }),
        catchError((taErrorRes) => {
          this.logger.error(
            `AIRTIME TOPUP ERROR response ---- ${JSON.stringify(taErrorRes.response.data)}`,
          );
          const taErrorMessage = taErrorRes.response.data;
          throw new NotFoundException(taErrorMessage);        
        }),
      );
  }
}
