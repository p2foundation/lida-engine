import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import * as https from 'https';
import { API_KEY, API_SECRET, ONE4ALL_BASEURL } from 'src/constants';
import { generateTransactionId } from 'src/utilities/utils';
import { SmsDto } from './dto/sms.dto';

@Injectable()
export class SmsService {
  private logger = new Logger('SmsService');
  private readonly smsBaseUrl = ONE4ALL_BASEURL;

  constructor(
    private httpService: HttpService
  ) { }

  getSendSMS(): any {

  }
  postBulkSMS(transDto: SmsDto): Observable<AxiosResponse<SmsDto>> {
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
    const newTaParams = JSON.stringify(pbsParams);

    const configs: any = {
      url: this.smsBaseUrl + `/TopUpApi/sms`,
      body: pbsParams,
      headers: { ApiKey: API_KEY, ApiSecret: API_SECRET },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.logger.log(`Post BulkSMS payload == ${JSON.stringify(configs)}`);

    return this.httpService.post<any>(configs.url, configs.body, { httpsAgent: configs.agent, headers: configs.headers })
      .pipe(
        map(pbsRes => {
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
