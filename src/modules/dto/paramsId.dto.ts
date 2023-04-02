import { z } from 'zod';

import { numberStringValidation } from 'helpers';

export const paramsIdDto = z.object({
  searchId: z
    .string()
    .regex(numberStringValidation.reg, { message: numberStringValidation.message }),
});
