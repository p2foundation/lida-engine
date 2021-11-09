export class TopupDto {
    readonly retailer: string;
    recipientMsisdn: string;
    amount: number;
    channel: number;
    clientReference: string;
}