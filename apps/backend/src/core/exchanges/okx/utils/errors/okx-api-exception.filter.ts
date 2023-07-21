import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ExchangeCode } from '@bifrost/types';
import { OkxApiException } from './okx-api.exception';

@Catch(OkxApiException)
export class OkxApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: OkxApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const fromExchange = {
      exchangeCode: ExchangeCode.OKX,
      requestPath: exception.requestPath,
      requestBody: exception.requestBody,
      responseBody: exception.responseBody,
      responseStatus: status,
      errorCode: exception.okxErrorCode,
    };

    this.logger.error(`[OKX] ${exception.requestPath}`, {
      fromExchange,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      fromExchange,
    });
  }
}
