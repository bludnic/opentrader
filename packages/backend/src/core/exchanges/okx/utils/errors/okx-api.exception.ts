import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { OKXResponse } from 'src/core/exchanges/okx/types/client/common/OKXResponse';

export class OkxApiException extends HttpException {
  public readonly okxErrorCode: string;
  public readonly requestPath: string;
  public readonly requestBody?: Record<string, any>;
  public readonly responseBody: OKXResponse<unknown>;

  constructor(
    response: OKXResponse<unknown>,
    httpStatus: HttpStatus,
    okxErrorCode: string,
    requestPath: string,
    requestBody?: Record<string, any>,
  ) {
    super(response, httpStatus);

    this.okxErrorCode = okxErrorCode;
    this.requestPath = requestPath;
    this.requestBody = requestBody;
    this.responseBody = response;
  }
}
