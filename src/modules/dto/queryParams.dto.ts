import { z } from 'zod';

const isNumber = {
  reg: /^\d+$/,
  message: 'Must be a string containing only numbers',
};

const queryParamsDtoGenerator = () => {
  return z.object({
    page: z.string().regex(isNumber.reg, { message: isNumber.message }).optional(),
    limit: z.string().regex(isNumber.reg, { message: isNumber.message }).optional(),
  });
};

export const productsQueryParamsDto = queryParamsDtoGenerator();
export const suppliesQueryParamsDto = queryParamsDtoGenerator();
export const ordersQueryParamsDto = queryParamsDtoGenerator();
export const employeesQueryParamsDto = queryParamsDtoGenerator();
export const customersQueryParamsDto = queryParamsDtoGenerator();
