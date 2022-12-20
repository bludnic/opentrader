import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';

export class NotEnoughFundsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.PAYMENT_REQUIRED);
  }
}
