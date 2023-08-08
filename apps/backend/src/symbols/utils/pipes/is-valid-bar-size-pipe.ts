import { BarSize } from '@bifrost/types';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class IsValidBarSizePipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): BarSize {
    const barSizes = Object.values(BarSize);
    const isValidBarSize = Object.values(BarSize).includes(value as BarSize);

    if (isValidBarSize) {
      return value as BarSize;
    }

    throw new BadRequestException(
      `${value} is not a valid bar size (use one of these values ${barSizes.join(
        ', ',
      )})`,
    );
  }
}
