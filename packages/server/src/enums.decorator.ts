import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

// options for custom decorator
type ApiPropertyEnumOptions<T extends { [key: string]: any }> = {
  /**
   * Indicates if multiple enum values can be used as the same time (thus being an array).
   * Defaults to `false`.
   */
  isArray?: boolean;

  /**
   * The enum that should be represented.
   */
  enum: T;

  /**
   * A unique name for the enum. All enums that are the same should use the same enumName.
   * It's sadly not possible to autogenertate since enums are not part of the JS ecosystem.
   */
  enumName: string;

  /**
   * The type of the enum values. Defaults to `'number'`.
   */
  type?: 'string' | 'number';
};

// util method that retrieves only "real" values from an enum
function getEnumValues<T extends { [key: string]: any }>(
  value: T,
): T[keyof T][] {
  return (Object.keys(value) as (keyof T)[])
    .filter((key): key is keyof T => isNaN(parseInt(key.toString(), 10)))
    .map(key => value[key]);
}

// create a custom decorator for enum values
export default function ApiPropertyEnum<T extends { [key: string]: any }>(
  options: ApiPropertyEnumOptions<T>,
): PropertyDecorator {
  const { enum: enumRef, enumName, isArray = false, type = 'number' } = options;

  const enumValues = getEnumValues(enumRef);
  const exampleValue = enumValues[0];

  return applyDecorators(
    ApiProperty({
      enum: enumValues,
      enumName,
      isArray,
      type,
      example: isArray ? [exampleValue] : exampleValue,
    }),
  );
}
