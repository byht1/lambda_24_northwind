import express from 'express';
import { ctrlWrapper } from 'helpers';
import { validate } from 'middleware';
import { customersQueryParamsDto } from 'modules/dto';
import { CustomersController } from './customers.controller';

const router = express.Router();
const breakpointName = 'customers';
const { getCustomers } = new CustomersController();

router.get(`/${breakpointName}`, validate(customersQueryParamsDto), ctrlWrapper(getCustomers));

export const customersRouter = router;
