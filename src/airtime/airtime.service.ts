import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import * as https from 'https';
import { API_KEY, API_SECRET, ONE4ALL_BASEURL, RETAILER } from 'src/constants';
import { TransStatusDto } from './dto/transtatus.dto';
import { TopupDto } from './dto/topup.dto';
import { generateTransactionId } from 'src/utilities/utils';


@Injectable()
export class AirtimeService {
  private logger = new Logger('AirtimeService');
  private AirBaseUrl = ONE4ALL_BASEURL;

  constructor(
    private readonly httpService: HttpService
  ) { }

  transactionStatus(transDto: TransStatusDto): Observable<AxiosResponse<TransStatusDto>> {
    const { transReference } = transDto;

    const payload = {
      trxn: transReference || ''
    };

    const tsUrl = this.AirBaseUrl + `/TopUpApi/transactionStatus?trxn=${payload.trxn}`

    const configs = {
      url: tsUrl,
      headers: { ApiKey: API_KEY, ApiSecret: API_SECRET },
      agent: new https.Agent({
        rejectUnauthorized: false,
      })
    };
    this.logger.log(`transaction status payload == ${JSON.stringify(configs)}`);

    return this.httpService.get(configs.url, { httpsAgent: configs.agent, headers: configs.headers })
      .pipe(
        map(tsRes => {
          this.logger.log(`Query TRANSACTION STATUS response ++++ ${JSON.stringify(tsRes)}`);
          return tsRes.data;
        }),
        catchError((tsError) => {
          this.logger.error(`Query TRANSACTION STATUS ERROR response ---- ${JSON.stringify(tsError.data)}`);
          return tsError.data;
        })
      );
  }

  topupAirtime(transDto: TopupDto): Observable<AxiosResponse<TopupDto>> {
    const {
      retailer,
      recipientMsisdn,
      amount,
      channel
    } = transDto;

    const clientReference = generateTransactionId();
    const taParams = {
      retailer: retailer || RETAILER,
      network: channel || 0,
      recipient: recipientMsisdn || '',
      amount: amount || '',
      trxn: clientReference || ''
    };
    const newTaParams = JSON.stringify(taParams);
    // https://tppgh.myone4all.com/api/TopUpApi/airtime?retailer=233241603241&recipient=233244588584&amount=1&network=0&trxn=1234567890

    const taUrl = `/TopUpApi/airtime?retailer=${taParams.retailer}&recipient=${taParams.recipient}&amount=${taParams.amount}&network=${taParams.network}&trxn=${taParams.trxn}`;

    const configs: any = {
      url: this.AirBaseUrl + taUrl,
      headers: { ApiKey: API_KEY, ApiSecret: API_SECRET },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.logger.log(`Airtime topup payload == ${JSON.stringify(configs)}`);

    return this.httpService.get<any>(configs.url, { httpsAgent: configs.agent, headers: configs.headers })
      .pipe(
        map(taRes => {
          this.logger.verbose(`AIRTIME TOPUP response ++++ ${JSON.stringify(taRes.data)}`);
          return taRes.data;
        }),
        catchError((taError) => {
          this.logger.error(`AIRTIME TOPUP ERROR response ---- ${JSON.stringify(taError.data)}`);
          return taError.data;
        })
      );
  }
}
