import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';

export class MissingCurrencyOnExchangeException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_ACCEPTABLE);
  }
}
