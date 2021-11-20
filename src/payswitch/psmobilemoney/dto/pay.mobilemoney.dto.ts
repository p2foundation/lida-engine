export class PayMobileMoneyDto {
    readonly merchantId?: string;
    readonly transId?: string;
    transType?: string;
    readonly serviceName: string;
    recipientName?: string;
    customerEmail: string;
    clientReference: string;
    customerMsisdn: string;
    token?: string;
    channel: string;
    amount: string;
    description: string;
    transStatus?: string;
    transMessage?: string;
    serviceStatus?: string;
    serviceTransId?: string;
    paymentStatus?: string;
    otherInfo?: string; 
}