import { isValidSymbolId } from '@bifrost/tools';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidSymbolIdValidator implements ValidatorConstraintInterface {
  validate(symbolId: string | undefined) {
    if (!symbolId) return false;

    return isValidSymbolId(symbolId);
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} must be a valid symbolId, e.g. OKX:BTC/USDT`;
  }
}

export function IsValidSymbolId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidSymbolIdValidator,
    });
  };
}
