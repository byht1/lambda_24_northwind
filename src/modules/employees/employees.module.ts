import express from 'express';
import { ctrlWrapper } from 'helpers';
import { validate } from 'middleware';
import { employeesQueryParamsDto } from 'modules/dto';
import { EmployeesController } from './employees.controller';

const router = express.Router();
const breakpointName = 'employees';
const { getEmployees } = new EmployeesController();

router.get(`/${breakpointName}`, validate(employeesQueryParamsDto), ctrlWrapper(getEmployees));

export const employeesRouter = router;
