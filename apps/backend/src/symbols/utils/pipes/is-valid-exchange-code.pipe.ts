import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isValidExchangeCode } from '@bifrost/tools';
import { ExchangeCode } from '@bifrost/types';

@Injectable()
export class IsValidExchangeCodePipe implements PipeTransform<string, string> {
  transform(value: ExchangeCode, metadata: ArgumentMetadata) {
    if (isValidExchangeCode(value)) {
      return value;
    }

    throw new BadRequestException(
      `${value} is not a valid "exchangeCode" (e.g. of a valid one OKX)`,
    );
  }
}
