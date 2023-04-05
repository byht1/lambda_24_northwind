import { TParamsId, TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { EmployeesService } from './employees.service';
import { TEmployeesAllRes, TEmployeesOneByIdRes } from 'db/repository';

interface IEmployeesController {
  getEmployees: TRouterFn<TEmployeesAllRes, TQuery>;
  getEmployeeId: TRouterFn<TEmployeesOneByIdRes, void, TParamsId>;
}

export class EmployeesController implements IEmployeesController {
  constructor(private employeesService: EmployeesService = new EmployeesService()) {}

  getEmployees: TRouterFn<TEmployeesAllRes, TQuery> = async (req, res) => {
    const query = req.query;
    const employees = await this.employeesService.getEmployees(query);

    return res.json(employees);
  };

  getEmployeeId: TRouterFn<TEmployeesOneByIdRes, void, TParamsId> = async (req, res) => {
    const { searchId } = req.params;
    const employee = await this.employeesService.getEmployeeId(+searchId);

    return res.json(employee);
  };
}
