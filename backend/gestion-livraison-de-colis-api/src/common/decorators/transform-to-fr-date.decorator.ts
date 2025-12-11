import { Transform } from 'class-transformer';
import { parse, isValid } from 'date-fns';

export const TransformFRDate = () => {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = parse(value, 'dd/MM/yyyy', new Date());
      if (isValid(parsed)) {
        return parsed;
      }
      // If parsing fails, return the original value to let validation handle the error
      return value;
    }
    return value;
  });
};