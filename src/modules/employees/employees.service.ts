import { TEmployees } from 'db/schema';
import { EmployeesDB } from 'db/services/EmployeesDB.service';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface IEmployeesService {
  getEmployees: (...args: [TQuery]) => Promise<TEmployees[]>;
}

export class EmployeesService implements IEmployeesService {
  constructor(private employeesDB: EmployeesDB = new EmployeesDB()) {}

  async getEmployees(query: TQuery): Promise<TEmployees[]> {
    const params = formatQueryParams(query);

    return this.employeesDB.getEmployees(params);
  }
}
