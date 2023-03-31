import {
  arrayColumnCustomers,
  arrayColumnEmployees,
  arrayColumnOrders,
  arrayColumnProducts,
  arrayColumnSupplies,
} from 'db/schema';
import { z } from 'zod';

const isNumber = {
  reg: /^\d+$/,
  message: 'Must be a string containing only numbers',
};

const queryParamsDtoGenerator = (fields: string[]) => {
  return z
    .object({
      page: z.string().regex(isNumber.reg, { message: isNumber.message }).optional(),
      limit: z.string().regex(isNumber.reg, { message: isNumber.message }).optional(),
      pick_select: z
        .string()
        .refine(
          value => {
            return value?.split(',').every(el => fields.includes(el));
          },
          {
            message: 'At least one of the fields does not exist',
            path: ['pink_and_omit'],
          }
        )
        .optional(),
      omit_select: z
        .string()
        .refine(
          value => {
            return value?.split(',').every(el => fields.includes(el));
          },
          {
            message: 'At least one of the fields does not exist',
            path: ['pink_and_omit'],
          }
        )
        .optional(),
    })
    .refine(
      obj => {
        if (obj.pick_select && obj.omit_select) return false;
        return true;
      },
      {
        message: 'pick_select and omit_select cannot be present at the same time',
        path: ['pink_and_omit'],
      }
    );
};

export const productsQueryParamsDto = queryParamsDtoGenerator(arrayColumnProducts);
export const suppliesQueryParamsDto = queryParamsDtoGenerator(arrayColumnSupplies);
export const ordersQueryParamsDto = queryParamsDtoGenerator(arrayColumnOrders);
export const employeesQueryParamsDto = queryParamsDtoGenerator(arrayColumnEmployees);
export const customersQueryParamsDto = queryParamsDtoGenerator(arrayColumnCustomers);

// export const queryParamsDto = z
//   .object({
//     page: z.string().regex(isNumber.reg, { message: isNumber.message }).optional(),
//     limit: z.string().regex(isNumber.reg, { message: isNumber.message }).optional(),
//     pick_select: z
//       .string()
//       .refine(
//         value => {
//           return value?.split(',').every(el => arrayColumnProducts.includes(el));
//         },
//         {
//           message: 'At least one of the fields does not exist',
//           path: ['pink_and_omit'],
//         }
//       )
//       .optional(),
//     omit_select: z
//       .string()
//       .refine(
//         value => {
//           return value?.split(',').every(el => arrayColumnProducts.includes(el));
//         },
//         {
//           message: 'At least one of the fields does not exist',
//           path: ['pink_and_omit'],
//         }
//       )
//       .optional(),
//   })
//   .refine(
//     obj => {
//       if (obj.pick_select && obj.omit_select) return false;
//       return true;
//     },
//     {
//       message: 'pick_select and omit_select cannot be present at the same time',
//       path: ['pink_and_omit'],
//     }
//   );
