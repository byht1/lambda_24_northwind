import { TEmployees } from 'db/schema';
import { EmployeesDB } from 'db/services/EmployeesDB.service';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

export type TGetEmployees = {
  name: string;
  id: string;
  title: string | null;
  city: string | null;
  country: string | null;
  homePhone: string | null;
};

interface IEmployeesService {
  getEmployees: (...args: [TQuery]) => Promise<TGetEmployees[]>;
}

export class EmployeesService implements IEmployeesService {
  constructor(private employeesDB: EmployeesDB = new EmployeesDB()) {}

  async getEmployees(query: TQuery): Promise<TGetEmployees[]> {
    const params = formatQueryParams(query);
    const employees = await this.employeesDB.getEmployees(params);
    const updateDataEmployees = employees.map(({ firstName, lastName, ...employee }) => ({
      ...employee,
      name: firstName + ' ' + lastName,
    }));

    return updateDataEmployees;
  }
}
