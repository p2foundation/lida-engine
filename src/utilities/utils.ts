import { Logger } from '@nestjs/common';
import {
  PAYSWITCH_APIKEY,
  PAYSWITCH_APIKEY_PROD,
  PAYSWITCH_USERNAME,
  PAYSWITCH_USERNAME_PROD,
} from 'src/constants';

export function generateMerchantKey() {
  const logger = new Logger();
  const merchantId = PAYSWITCH_USERNAME_PROD;
  const merchantToken = PAYSWITCH_APIKEY_PROD;

  const encodedAuth =
    '' + Buffer.from(merchantId + ':' + merchantToken).toString('base64');
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
  const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
  const year = date.getFullYear().toString().substr(2, 2);
  const customDate = '' + month + day + year;
  for (let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  const transId = text + customDate;
  // logger.log('generated random transaction +++' + transId);
  return transId;
}

export function generateTransactionIdPayswitch() {
  const logger = new Logger();

  let text = '';
  const possible = '0123456789';
  const date = new Date();
  const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
  const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
  const year = date.getFullYear().toString().substr(2, 2);
  const customDate = '' + month + day + year;
  for (let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  const transId = text + customDate;
  // logger.log('generated random transaction +++' + transId);
  return transId;
}


