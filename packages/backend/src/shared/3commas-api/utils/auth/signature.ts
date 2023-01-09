import { HmacSHA256 } from 'crypto-js';
import { enc } from 'crypto-js';

/**
 * @inspiration https://3commas-io.github.io/public-api-signature-calculator-example/
 *
 * @param secretKey
 * @param requestPath e.g. /public/api/ver1/accounts/new?type=binance&name=binance_account&api_key=XXXXXX&secret=YYYYYY
 */
export function signature(requestPath: string, secretKey: string): string {
  return HmacSHA256(requestPath, secretKey).toString(enc.Hex);
}
