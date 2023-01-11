import { API } from '3commas-typescript';
import { ThreeCommasContext } from 'src/shared/3commas-api/types/3commas-context.interface';

export class ThreeCommasApiClient {
  static fromContext(ctx: ThreeCommasContext): API {
    const { threeCommasAccount } = ctx;

    const client = new API({
      key: threeCommasAccount.credentials.apiKey, // Optional if only query endpoints with no security requirement
      secrets: threeCommasAccount.credentials.secretKey, // Optional
      timeout: 60000, // Optional, in ms, default to 30000
      forcedMode: threeCommasAccount.credentials.isPaperAccount ? 'paper' : 'real',
    });

    return client;
  }
}
