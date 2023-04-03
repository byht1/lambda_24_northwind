import express from 'express';
import { ctrlWrapper } from 'helpers';
import { validate } from 'middleware';
import { employeesQueryParamsDto, paramsIdIsNumberDto } from 'modules/dto';
import { EmployeesController } from './employees.controller';

const router = express.Router();
const breakpointName = 'employees';
const { getEmployees, getEmployeeId } = new EmployeesController();

router.get(`/${breakpointName}`, validate(employeesQueryParamsDto), ctrlWrapper(getEmployees));
router.get(
  `/${breakpointName}/:searchId`,
  //   validate(paramsIdIsNumberDto),
  ctrlWrapper(getEmployeeId)
);

export const employeesRouter = router;
