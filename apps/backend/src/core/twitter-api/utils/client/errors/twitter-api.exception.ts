import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { TwitterApiErrorResponse } from 'src/core/twitter-api/types/client/common/twitter-api-error-response';

export class TwitterApiException extends HttpException {
  public readonly requestPath: string;
  public readonly requestBody?: Record<string, any>;
  public readonly responseBody: TwitterApiErrorResponse;

  constructor(
    responseBody: TwitterApiErrorResponse,
    httpStatus: HttpStatus,
    requestPath: string,
    requestBody?: Record<string, any>,
  ) {
    super(responseBody, httpStatus);

    this.requestPath = requestPath;
    this.requestBody = requestBody;
    this.responseBody = responseBody;
  }
}
