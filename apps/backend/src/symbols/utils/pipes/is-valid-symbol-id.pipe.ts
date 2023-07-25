import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isValidSymbolId } from '@bifrost/tools';

@Injectable()
export class IsValidSymbolIdPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (isValidSymbolId(value)) {
      return value;
    }

    throw new BadRequestException(
      `${value} is not a valid symbol ID (e.g. of a valid one OKX:ETH/USDT)`,
    );
  }
}
