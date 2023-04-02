import { z } from 'zod';

import { numberStringValidation } from 'helpers';

const queryParamsDtoGenerator = () => {
  return z.object({
    page: z
      .string()
      .regex(numberStringValidation.reg, { message: numberStringValidation.message })
      .optional(),
    limit: z
      .string()
      .regex(numberStringValidation.reg, { message: numberStringValidation.message })
      .optional(),
  });
};

export const productsQueryParamsDto = queryParamsDtoGenerator();
export const suppliesQueryParamsDto = queryParamsDtoGenerator();
export const ordersQueryParamsDto = queryParamsDtoGenerator();
export const employeesQueryParamsDto = queryParamsDtoGenerator();
export const customersQueryParamsDto = queryParamsDtoGenerator();
