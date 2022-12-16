import * as CryptoJS from 'crypto-js';

/**
 * @param requestMethod e.g. GET
 * @param requestPath e.g. /users/self/verify
 * @param requestBody String concatenation of object, use empty string "" if no body present
 * @param secretKey OKexApiConfiguration["secretKey"]
 * @param timestamp e.g. 2020-12-08T09:08:57.715Z
 */
export function okexSignature(
  requestMethod: 'GET' | 'POST' | 'DELETE' | 'PUT',
  requestPath: string,
  requestBody: string,
  secretKey: string,
  timestamp: string,
): string {
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(
      timestamp + requestMethod + requestPath + requestBody,
      secretKey,
    ),
  );
}
