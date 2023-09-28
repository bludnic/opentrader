import { InternalServerErrorException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { response } from 'express';
import { TwitterApiErrorResponse } from 'src/core/twitter-api/types/client/common/twitter-api-error-response';
import { TwitterApiException } from './twitter-api.exception';

/**
 * @param requestPath
 * @param requestBody
 */
export function throwExceptionIfErrorHttpStatus(
  requestPath: string,
  requestBody?: Record<string, any>,
): (error: AxiosError<TwitterApiErrorResponse> | Error) => never {
  return (error) => {
    const isAxiosError = 'isAxiosError' in error;

    if (isAxiosError && error.response) {
      const { response } = error;

      throw new TwitterApiException(
        response.data,
        response.status,
        requestPath,
        requestBody,
      );
    }

    throw new InternalServerErrorException(error);
  };
}
