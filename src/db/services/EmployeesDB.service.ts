import { employees, TableEmployees, TEmployees } from 'db/schema';
import { TableDB, TParams } from './tableDB.service';

export class EmployeesDB extends TableDB<TEmployees, TableEmployees> {
  constructor() {
    super(employees);
  }

  getEmployees = async (params: TParams) => this.getAllData(params);
}
