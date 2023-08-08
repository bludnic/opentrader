import { areGridLinesPricesSortedInAscOrder } from '@bifrost/tools';
import { IGridLine } from '@bifrost/types';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class AreGridLinesSortedInAscOrderConstraint
  implements ValidatorConstraintInterface
{
  validate(gridLines: IGridLine[] | undefined, args: ValidationArguments) {
    if (!Array.isArray(gridLines)) return false;

    return areGridLinesPricesSortedInAscOrder(gridLines);
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} should be sorted by 'price' in ASC order`;
  }
}

export function AreGridLinesSortedInAscOrder(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AreGridLinesSortedInAscOrderConstraint,
    });
  };
}
