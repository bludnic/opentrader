import { ValidationOptions, registerDecorator } from 'class-validator';
import { isValidEntityId } from '../../../utils/candlesticks-history/isValidEntityId';

export function IsValidEntityId(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(entityId: string): boolean {
          return isValidEntityId(entityId);
        },
      },
    });
  };
}
