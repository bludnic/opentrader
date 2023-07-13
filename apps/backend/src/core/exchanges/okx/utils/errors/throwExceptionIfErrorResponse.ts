import { AxiosResponse } from 'axios';
import { OKXResponse } from 'src/core/exchanges/okx/types/client/common/OKXResponse';
import { OkxApiException } from './okx-api.exception';

/**
 * OKx API возвращает статус 200 для некоторых ошибок.
 *
 * Функция проверяет `res.code` и выбрасывает исключение
 * чтобы промис не зарезолвился и все пошло по пизде.
 *
 * See all status codes:
 * https://www.okex.com/docs-v5/en/#error-code
 *
 * @param requestPath
 * @param requestBody
 */
export function throwExceptionIfErrorResponse<T>(
  requestPath: string,
  requestBody?: Record<string, any>,
): (
  axiosResponse: AxiosResponse<OKXResponse<T>, any>,
) => AxiosResponse<OKXResponse<T>, any> {
  return (response) => {
    const { data: okxResponse, status: httpStatus } = response;
    const { code } = okxResponse;

    if (code === '0') {
      // 0 means success
      return response;
    }

    throw new OkxApiException(
      okxResponse,
      httpStatus,
      code,
      requestPath,
      requestBody,
    );
  };
}
