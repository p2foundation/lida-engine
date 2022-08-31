import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as https from 'https';
import { TransferMobileMoneyDto } from './dto/transfer.mobilemoney.dto';
import {
  generateMerchantKey,
  generateTransactionId,
  generateTransactionIdPayswitch,
} from 'src/utilities/utils';
import {
  PAYSWITCH_APIKEY_PROD,
  PAYSWITCH_MERCHANTID,
  PAYSWITCH_TEST_BASEURL,
  PAYSWITCH_USERNAME_PROD,
  PAYSWTICH_PROD_BASEURL,
  PROCESSING_CODE_DEBIT,
  PROCESSING_CODE_SEND,
  PAYSWITCH_CHECKOUT_URL
} from "src/constants";
import { PayMobileMoneyDto } from './dto/pay.mobilemoney.dto';

@Injectable()
export class PsmobilemoneyService {
  private logger = new Logger('PsmobilemoneyService');

  constructor(private httpService: HttpService) { }

  public primaryCallbackUrl() {
    // https://webhook.site/da10dbc3-9adf-4b2c-b7dd-fd03d3504fa0?amount=1&channel=mobile&code=040&currency=GHS&r_switch=MTN&reason=You%20are%20not%20allowed%20to%20transact%20with%20MTN%20%28Mtn%29&status=Access%20Denied&subscriber_number=0244588584&transaction_id=000000123457
  }

  public transferMobilemoney(
    transDto: TransferMobileMoneyDto,
  ): Observable<AxiosResponse<TransferMobileMoneyDto>> {
    const { description, recipientMsisdn, amount, transType, channel } =
      transDto;

    const tmParams: any = {
      amount: amount || '',
      processing_code: PROCESSING_CODE_SEND,
      transaction_id: generateTransactionId() || '',
      desc: description,
      merchant_id: PAYSWITCH_MERCHANTID,
      subscriber_number: recipientMsisdn,
      'r-switch': channel,
    };
    // https://tppgh.myone4all.com/api/TopUpApi/b2c?recipient=233245667942&amount=1&trxn=1234567890

    // const sm2Url = `/TopUpApi/b2c?recipient=${tmParams.recipient}&amount=${tmParams.amount}&trxn=${tmParams.trxn}`;
    const base64_encode = generateMerchantKey();
    const configs = {
      url: 'https://prod.theteller.net/v1.1/transaction/process',
      body: tmParams,
      headers: {
        Authorization: `Basic ${base64_encode}`,
      },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.logger.log(
      `TRANSFER MOBILE MONEY payload config == ${JSON.stringify(configs)}`,
    );
    return this.httpService
      .post(configs.url, configs.body, {
        headers: configs.headers,
        httpsAgent: configs.agent,
      })
      .pipe(
        map((tmRes) => {
          this.logger.verbose(
            `TRANSFER MOBILE MONEY server response => ${JSON.stringify(
              tmRes.data,
            )}`,
          );
          // if (res.data.Status === 0) {
          //     this.logger.error(`debit wallet service response STATUS =  ${JSON.stringify(res.data.Status)}`);
          //     this.logger.error(`service response MESSAGE =  ${JSON.stringify(res.data.Message)}`);
          //     this.logger.error(`service response DETAILS = ${JSON.stringify(res.data.Details)}`);
          // } else if (res.data.Status === 1) {
          //     this.logger.debug(`debit wallet  service response TRANSACTION ID == ${JSON.stringify(res.data.Transactionid)}`);
          //     this.logger.debug(`service response STATUS ==  ${JSON.stringify(res.data.Status)}`);
          //     this.logger.debug(`response MESSAGE ==  ${JSON.stringify(res.data.Message)}`);
          //     this.logger.debug(`response MERCHANT REFERENCE == ${JSON.stringify(res.data.MerchantReference)}`);
          // } else if (res.data.Status === 2) {
          //     this.logger.warn(`debit wallet service response STATUS =  ${JSON.stringify(res.data.Status)}`);
          //     this.logger.warn(`service response MESSAGE =  ${JSON.stringify(res.data.Message)}`);
          //     this.logger.warn(`service response TRANSACTIONID = ${JSON.stringify(res.data.transactionid)}`);
          // }

          return tmRes.data;
        }),
        catchError((Sm2Error) => {
          this.logger.error(`ERROR TRANSFER MOBILE MONEY => ${Sm2Error.data}`);
          return Sm2Error.data;
        }),
      );
  }

  public mobilemoneyPayment(
    transDto: PayMobileMoneyDto,
  ): Observable<AxiosResponse<PayMobileMoneyDto>> {
    const {
      customerMsisdn,
      amount,
      processingCode,
      description,
      channel
    } = transDto;

    const localTansId: any = generateTransactionIdPayswitch();
    this.logger.log(`local transaction id ==> ${localTansId}`);

    const mpParams = {
      "amount": amount || '',
      "processing_code": PROCESSING_CODE_DEBIT || processingCode,
      "transaction_id": localTansId,
      "desc": description || 'Lidapay mobile money debit ',
      "merchant_id": PAYSWITCH_MERCHANTID,
      "subscriber_number": customerMsisdn || '',
      "r-switch": channel
    };

    const base64_encode = generateMerchantKey();

    const configs = {
      url: PAYSWTICH_PROD_BASEURL + '/v1.1/transaction/process',
      body: mpParams,
      headers: {
        Authorization: `Basic ${base64_encode}`,
      },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.logger.log(
      `RECEIVE MONEY payload config == ${JSON.stringify(configs)}`,
    );
    return this.httpService
      .post(configs.url, configs.body, {
        httpsAgent: configs.agent,
        headers: configs.headers
      })
      .pipe(
        map((mpRes) => {
          this.logger.log(`RECEIVE MONEY server response => ${JSON.stringify(mpRes.data)}`);
           
          return mpRes.data;
        }),
        catchError((mpError) => {
          this.logger.error(`ERROR DEBIT WALLET => ${JSON.stringify(mpError.data)}`);
          return mpError.data;
        }),
      );
  }
}
