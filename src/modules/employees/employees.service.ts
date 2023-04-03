import { TEmployees } from 'db/schema';
import { EmployeesDB, TEmployeeDBResponse } from 'db/services/EmployeesDB.service';
import { TCalcPage } from 'db/services/tableDB.service';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

type TEmployeesDB = {
  name: string;
  id: string;
  title: string | null;
  city: string | null;
  country: string | null;
  homePhone: string | null;
};

export type TGetEmployees = TCalcPage & {
  employees: TEmployeesDB[];
};

interface IEmployeesService {
  getEmployees: (...args: [TQuery]) => Promise<TGetEmployees>;
  getEmployeeId: (...args: [number]) => Promise<TEmployeeDBResponse>;
}

export class EmployeesService implements IEmployeesService {
  constructor(private employeesDB: EmployeesDB = new EmployeesDB()) {}

  getEmployees = async (query: TQuery): Promise<TGetEmployees> => {
    const params = formatQueryParams(query);
    const employees = await this.employeesDB.getEmployees(params);
    const updateDataEmployees = employees.employees.map(({ firstName, lastName, ...employee }) => ({
      ...employee,
      name: firstName + ' ' + lastName,
    }));

    return { ...employees, employees: updateDataEmployees };
  };

  getEmployeeId = async (searchId: number): Promise<TEmployeeDBResponse> => {
    const employee = await this.employeesDB.getEmployeeById(searchId);

    return employee;
  };
}
