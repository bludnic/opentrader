import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { TwitterApiException } from './twitter-api.exception';

@Catch(TwitterApiException)
export class TwitterApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: TwitterApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const fromTwitterApi = {
      requestPath: exception.requestPath,
      requestBody: exception.requestBody,
      responseBody: exception.responseBody,
      responseStatus: status,
    };

    this.logger.error(`[Twitter] ${exception.requestPath}`, {
      fromTwitterApi,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      fromTwitterApi,
    });
  }
}
