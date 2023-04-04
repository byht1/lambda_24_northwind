import { numberStringValidation } from 'helpers';
import { z } from 'zod';

const table = ['customers', 'products'] as const;
const fieldProducts = ['productName', 'quantityPerUnit'] as const;
const fieldCustomer = ['companyName', 'contactName', 'contactTitle', 'phone'] as const;
const field = [...fieldProducts, ...fieldCustomer] as const;

type Table = typeof table[number];
type TFieldEnum = typeof fieldProducts | typeof fieldCustomer;

const generateMessage = (tableName: Table) => {
  const enumValue = tableName === 'customers' ? fieldCustomer.join(', ') : fieldProducts.join(', ');
  return `Field "field" for table "${tableName}" must have one of the following values: ${enumValue}`;
};

const validateFieldEnum = (userValue: string, fieldEnum: TFieldEnum) => {
  return fieldEnum.some(parameter => parameter === userValue);
};

const searchValue = {
  reg: /^[a-zA-Z0-9()\-'"`,?!;:\s]+$/,
  message: 'Invalid query string',
};

export const searchDto = z
  .object({
    searchValue: z.string().regex(searchValue.reg, { message: searchValue.message }),
    table: z.enum(table),
    field: z.enum(field).optional(),
    page: z
      .string()
      .regex(numberStringValidation.reg, { message: numberStringValidation.message })
      .optional(),
    limit: z
      .string()
      .regex(numberStringValidation.reg, { message: numberStringValidation.message })
      .optional(),
  })
  .refine(
    ({ table, field }) => {
      if (!field) return true;

      switch (table) {
        case 'customers':
          return validateFieldEnum(field, fieldCustomer);

        case 'products':
          return validateFieldEnum(field, fieldProducts);

        default:
          return new Error('error');
      }
    },
    ({ table }) => ({
      message: generateMessage(table),
      path: ['field'],
    })
  );
