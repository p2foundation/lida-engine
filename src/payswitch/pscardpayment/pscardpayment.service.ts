import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as https from 'https';
import { HttpService } from '@nestjs/axios';
import { CardPaymentDto } from './dto/card.payments.dto';
import { generateMerchantKey } from 'src/utilities/utils';
import { PAYSWITCH_APIKEY, PAYSWITCH_TEST_BASEURL, PAYSWITCH_USERNAME } from 'src/constants';
import { CallbackDto } from './dto/callback.dto';
import { InlinePayDto } from './dto/inline.pay.dto';
import { psRandomGeneratedNumber } from 'src/utilities/ps.utils';

@Injectable()
export class PscardpaymentService {
  private logger = new Logger('PsmobilemoneyService');

  constructor(
    private httpService: HttpService
  ) { }

  public psCallback(transDto: CallbackDto): Observable<AxiosResponse<CallbackDto>> {
    const { status, transaction_id, reason, } = transDto;
    // const payload = { data };

    const configs = {
      url: '',
      body: 'payload',
    };
    this.logger.log(`test post payload == ${JSON.stringify(configs)}`);
    return this.httpService.post(configs.url, configs.body).pipe(
      map(wcRes => {
        this.logger.log(`service response STATUS ==  ${JSON.stringify(wcRes.data)}`);
        return wcRes.data;
      }),
    );
  }


  public inlinePayments(transDto: InlinePayDto): Observable<AxiosResponse<CardPaymentDto>> {
    const { merchantId, transId, description, amount, redirectURL, customerEmail } = transDto;

    const ipParams: any = {
      merchant_id: merchantId || '',
      transaction_id: psRandomGeneratedNumber(),
      desc: description,
      amount,
      redirect_url: redirectURL,
      email: customerEmail,
    };

    const configs = {
      url: 'https://test.theteller.net/checkout/initiate',
      body: ipParams,
      auth: {
        username: `${PAYSWITCH_USERNAME}`,
        password: `${PAYSWITCH_APIKEY}`
      },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.logger.log(`INLINE PAYMENT payload config == ${JSON.stringify(configs)}`);
    return this.httpService.post(configs.url, configs.body, { httpsAgent: configs.agent, auth: configs.auth }).pipe(
      map((tmRes) => {
        this.logger.verbose(`INLINE PAYMENT server response => ${JSON.stringify(tmRes.data)}`);

        return tmRes.data;
      }),
      catchError(ipError => {
        this.logger.error(`ERROR INLINE PAYMENT => ${ipError.data}`);
        return ipError.data;
      }),
    );
  }
  public cardPayment(transDto: CardPaymentDto): Observable<AxiosResponse<CardPaymentDto>> {
    const {
      description,
      amount,
      transType,
      channel
    } = transDto;

    const cpParams: any = {
      "processing_code": "000000",
      "r-switch": "VIS",
      "transaction_id": "000000000000",
      "merchant_id": "Your merchant ID",
      "pan": "4310000000000000",
      "3d_url_response": "your_redirect_url",
      "exp_month": "05",
      "exp_year": "21",
      "cvv": "000",
      "desc": "Card Payment Test",
      "amount": "000000000100",
      "currency": "GHS",
      "card_holder": "Card Holder Name",
      "customer_email": "Customer Email"
    };

    const base64_encode = generateMerchantKey();

    const configs = {
      url: PAYSWITCH_TEST_BASEURL + '/v1.1/transaction/process',
      body: cpParams,
      headers: {
        Authorization: `Basic ${base64_encode}`
      },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.logger.log(`CARD PAYMENT payload config == ${JSON.stringify(configs)}`);
    return this.httpService.post(configs.url, configs.body, { httpsAgent: configs.agent, headers: configs.headers }).pipe(
      map((tmRes) => {
        this.logger.verbose(`CARD PAYMENT server response => ${JSON.stringify(tmRes.data)}`);
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
      catchError(Sm2Error => {
        this.logger.error(`ERROR CARD PAYMENT => ${Sm2Error.data}`);
        return Sm2Error.data;
      }),
    );
  }

}
