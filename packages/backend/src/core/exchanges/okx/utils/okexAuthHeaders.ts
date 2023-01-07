import { okexSignature } from 'src/core/exchanges/okx/utils/okexSignature';
import { IExchangeContext } from 'src/core/exchanges/types/exchange-context.interface';

export function okexAuthHeaders(
  ctx: IExchangeContext,
  requestMethod: 'GET' | 'POST' | 'DELETE' | 'PUT',
  requestPath: string,
  requestBody?: Record<string, any>,
) {
  const timestamp = new Date().toISOString();
  const signature = okexSignature(
    requestMethod,
    requestPath,
    requestBody ? JSON.stringify(requestBody) : '',
    ctx.exchangeAccount.credentials.secretKey,
    timestamp,
  );

  return {
    'OK-ACCESS-KEY': ctx.exchangeAccount.credentials.apiKey,
    'OK-ACCESS-SIGN': signature,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'OK-ACCESS-PASSPHRASE': ctx.exchangeAccount.credentials.passphrase,
    // Note: `x-simulated-trading: 1` needs to be added to the header of the Demo Trading request.
    // @see https://www.okex.com/docs-v5/en/#overview-demo-trading-services
    'x-simulated-trading': ctx.exchangeAccount.credentials.isDemoAccount
      ? '1'
      : '',
  };
}
