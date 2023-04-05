import { EmployeesRepository, TEmployeesAllRes, TEmployeesOneByIdRes } from 'db/repository';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface IEmployeesService {
  getEmployees: (...args: [TQuery]) => Promise<TEmployeesAllRes>;
  getEmployeeId: (...args: [number]) => Promise<TEmployeesOneByIdRes>;
}

export class EmployeesService implements IEmployeesService {
  constructor(private employeesDB: EmployeesRepository = new EmployeesRepository()) {}

  getEmployees = async (query: TQuery): Promise<TEmployeesAllRes> => {
    const params = formatQueryParams(query);
    const employees = await this.employeesDB.getAll(params);

    return employees;
  };

  getEmployeeId = async (searchId: number): Promise<TEmployeesOneByIdRes> => {
    const employee = await this.employeesDB.getOneById(searchId);

    return employee;
  };
}
