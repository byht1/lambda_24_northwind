import { z } from 'zod';

import { letterValidation, numberStringValidation } from 'helpers';

export const paramsIdIsNumberDto = z.object({
  searchId: z
    .string()
    .regex(numberStringValidation.reg, { message: numberStringValidation.message }),
});

export const paramsIdIsLettersDto = z.object({
  searchId: z.string().regex(letterValidation.reg, { message: letterValidation.message }),
});
