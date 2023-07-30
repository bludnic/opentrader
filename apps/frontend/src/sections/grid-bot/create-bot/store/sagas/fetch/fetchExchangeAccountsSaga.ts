import { AxiosResponse } from 'axios';
import { call, put } from 'redux-saga/effects';
import { bifrostApi } from 'src/lib/bifrost/apiClient';
import { GetExchangeAccountsResponseBodyDto } from 'src/lib/bifrost/client';
import { fetchExchangeAccounts, fetchExchangeAccountsSucceeded } from 'src/store/exchange-accounts';

export function* fetchExchangeAccountsSaga() {
  yield put(fetchExchangeAccounts());

  const {
    data: { exchangeAccounts },
  }: AxiosResponse<GetExchangeAccountsResponseBodyDto> = yield call(
    bifrostApi.getExchangeAccounts
  );

  yield put(fetchExchangeAccountsSucceeded(exchangeAccounts));

  return {
    exchangeAccounts
  }
}
