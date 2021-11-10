import { Logger } from '@nestjs/common';


export function generateMerchantKey() {
  const logger = new Logger();
  const merchantId = '';
  const merchantToken = '';

  const encodedAuth = '' + Buffer.from(merchantId + ':' + merchantToken).toString('base64');
  logger.log('encoded string toBase64 Auth ===>');
  logger.debug(encodedAuth);

  return encodedAuth;
}

export function generateTransactionId() {
  const logger = new Logger();

  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const date = new Date();
  const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
  const month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
  const year = date.getFullYear().toString().substr(2, 2);
  const customDate = '' + month + day + year;
  for (let i = 0; i <10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  const transId = text + customDate;
  // logger.log('generated random transaction +++' + transId);
  return transId;
}
