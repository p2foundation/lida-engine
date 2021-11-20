import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import * as https from 'https';
import { ONE4ALL_APIKEY, ONE4ALL_APISECRET, ONE4ALL_BASEURL } from 'src/constants';
import { generateTransactionId } from 'src/utilities/utils';
import { SmsDto } from './dto/sms.dto';

@Injectable()
export class SmsService {
  private logger = new Logger('SmsService');
  private readonly smsBaseUrl = ONE4ALL_BASEURL;

  constructor(
    private httpService: HttpService
  ) { }

  public SendSMS(transDto: SmsDto): Observable<AxiosResponse<SmsDto>> {
    const {
      recipient,
      message,
      senderId,
    } = transDto;

    const s2Params = {
      recipient: recipient || '',
      message: message || '',
      sender_id: senderId || '',
      trxn: generateTransactionId() || ''
    };

    // https://tppgh.myone4all.com/api/TopUpApi/sms?recipient=0244588584&message=test%20sms&sender_id=covid19%20Alert&trxn=353452ewrtret;
    // https://tppgh.myone4all.com/api/TopUpApi/sms?recipient=233244588584&message=Welcome! You have been successfully subscribed to the Lida Loyalty platform. &sender_id=Welcome! You have been successfully subscribed to the Lida Loyalty platform. &trxn=B4HN9GIFCD111021
    const s2Url = `recipient=${s2Params.recipient}&message=${s2Params.message}&sender_id=${s2Params.sender_id}&trxn=${s2Params.trxn}`;

    const configs: any = {
      url: this.smsBaseUrl+`/TopUpApi/sms?`+s2Url,
      headers: { ApiKey: ONE4ALL_APIKEY, ApiSecret: ONE4ALL_APISECRET },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.logger.log(`Post BulkSMS payload ==> ${JSON.stringify(configs)}`);

    return this.httpService.get(configs.url, { httpsAgent: configs.agent, headers: configs.headers })
      .pipe(
        map((pbsRes) => {
          this.logger.verbose(`BulkSMS response ++++ ${JSON.stringify(pbsRes.data)}`);
          return pbsRes.data;
        }),
        catchError((taError) => {
          this.logger.error(`BulkSMS ERROR response ---- ${JSON.stringify(taError.data)}`);
          return taError.data;
        })
      );
  }

  public postBulkSMS(transDto: SmsDto): Observable<AxiosResponse<SmsDto>> {
    const {
      recipient,
      message,
      senderId,
    } = transDto;

    const pbsParams = {
      recipient: recipient || '',
      message: message || '',
      sender_id: senderId || '',
      trxn: generateTransactionId() || ''
    };

    const configs: any = {
      url: this.smsBaseUrl + `/TopUpApi/sms`,
      body: pbsParams,
      headers: { ApiKey: ONE4ALL_APIKEY, ApiSecret: ONE4ALL_APISECRET },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.logger.log(`Post BulkSMS payload == ${JSON.stringify(configs)}`);

    return this.httpService.post(configs.url, configs.body, { httpsAgent: configs.agent, headers: configs.headers })
      .pipe(
        map((pbsRes) => {
          this.logger.verbose(`BulkSMS response ++++ ${JSON.stringify(pbsRes.data)}`);
          return pbsRes.data;
        }),
        catchError((taError) => {
          this.logger.error(`BulkSMS ERROR response ---- ${JSON.stringify(taError.data)}`);
          return taError.data;
        })
      );
  }

}
