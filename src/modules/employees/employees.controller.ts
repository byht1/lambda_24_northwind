import { TParamsId, TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { TEmployees } from 'db/schema';
import { EmployeesService, TGetEmployees } from './employees.service';
import { TEmployeeDBResponse } from 'db/services/EmployeesDB.service';

interface IEmployeesController {
  getEmployees: TRouterFn<TGetEmployees, TQuery>;
  getEmployeeId: TRouterFn<TEmployeeDBResponse, void, TParamsId>;
}

export class EmployeesController implements IEmployeesController {
  constructor(private employeesService: EmployeesService = new EmployeesService()) {}

  getEmployees: TRouterFn<TGetEmployees, TQuery> = async (req, res) => {
    const query = req.query;
    const employees = await this.employeesService.getEmployees(query);

    return res.json(employees);
  };

  getEmployeeId: TRouterFn<TEmployeeDBResponse, void, TParamsId> = async (req, res) => {
    const { searchId } = req.params;
    const employee = await this.employeesService.getEmployeeId(+searchId);

    return res.json(employee);
  };
}
