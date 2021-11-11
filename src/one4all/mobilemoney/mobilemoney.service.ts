import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as https from 'https';
import { API_KEY, API_SECRET, ONE4ALL_BASEURL } from 'src/constants';
import { ReceiveMoneyDto } from './dto/receive.money.dto';
import { generateTransactionId } from 'src/utilities/utils';

@Injectable()
export class MobilemoneyService {
    private logger = new Logger('MobilemoneyService');
    private readonly momoBaseUrl = ONE4ALL_BASEURL;

    constructor(
        private httpService: HttpService
    ) { }

    sendMobileMoney() {
        return 'credit customer mobile money wallet';
    }

    receiveMobileMoney(transDto: ReceiveMoneyDto): Observable<AxiosResponse<ReceiveMoneyDto>> {
        const {
            clientReference,
            recipientMsisdn,
            amount,
        } = transDto;

        const rm2Params = {
            recipient: recipientMsisdn || '',
            amount: amount || '',
            trxn: generateTransactionId() || '',
        };
        // https://tppgh.myone4all.com/api/TopUpApi/c2b?recipient=233245667942&amount=1&trxn=1234567890

        const rm2Url = `/TopUpApi/c2b?recipient=${rm2Params.recipient}&amount=${rm2Params.amount}&trxn=${rm2Params.trxn}`;

        const configs = {
            url: this.momoBaseUrl + rm2Url,
            headers: { ApiKey: API_KEY, ApiSecret: API_SECRET },
            agent: new https.Agent({
                rejectUnauthorized: false,
            }),
        };
        this.logger.log(`RECEIVE MONEY payload config == ${JSON.stringify(configs)}`);
        return this.httpService.get(configs.url, { httpsAgent: configs.agent, headers: configs.headers }).pipe(
            map(res => {
                this.logger.verbose(`RECEIVE MONEY server response => ${res.data}`);
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

                return res.data;
            }),
        );
    }

}
