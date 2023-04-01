import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { TEmployees } from 'db/schema';
import { EmployeesService, TGetEmployees } from './employees.service';

interface IEmployeesController {
  getEmployees: TRouterFn<TGetEmployees, TQuery>;
}

export class EmployeesController implements IEmployeesController {
  constructor(private employeesService: EmployeesService = new EmployeesService()) {}

  getEmployees: TRouterFn<TGetEmployees, TQuery> = async (req, res) => {
    const query = req.query;
    const employees = await this.employeesService.getEmployees(query);

    return res.json(employees);
  };
}
