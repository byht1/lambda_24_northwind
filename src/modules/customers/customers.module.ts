import express from 'express';
import { ctrlWrapper } from 'helpers';
import { validate } from 'middleware';
import { customersQueryParamsDto, paramsIdIsLettersDto } from 'modules/dto';
import { CustomersController } from './customers.controller';

const router = express.Router();
const breakpointName = 'customers';
const { getCustomers, getCustomerId, search } = new CustomersController();

router.get(`/${breakpointName}`, validate(customersQueryParamsDto), ctrlWrapper(getCustomers));
router.get(
  `/${breakpointName}/:searchId`,
  validate(paramsIdIsLettersDto, 'params'),
  ctrlWrapper(getCustomerId)
);
router.get(`/${breakpointName}/search/:searchValue`, ctrlWrapper(search));

export const customersRouter = router;
