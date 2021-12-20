export class TopupDto {
  readonly retailer: string;
  recipientNumber: string;
  amount: number;
  charge?: string;
  channel?: number;
  network?: number;
  clientReference?: string;
  transType?: string;
  customerName?: string;
  customerEmail?: string;
  description?: string;
  serviceStatusCode?: string;
  statusNarration?: string;
  paymentStatus?: string;
  redirectURL?: string;
}
