import { IThreeCommasAccount } from 'src/core/db/types/entities/3commas-accounts/account/3commas-account.interface';
import { ThreeCommasContext } from 'src/shared/3commas-api/types/3commas-context.interface';

export function getContextByAccount(
  threeCommasAccount: IThreeCommasAccount,
): ThreeCommasContext {
  return {
    threeCommasAccount,
  };
}
