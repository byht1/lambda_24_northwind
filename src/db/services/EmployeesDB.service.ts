import { employees, TableEmployees, TEmployees } from 'db/schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';

export type TGetEmployees = Pick<
  TEmployees,
  'id' | 'lastName' | 'firstName' | 'title' | 'city' | 'homePhone' | 'country'
>;

export type TGetEmployeesDB = TCalcPage & {
  employees: TGetEmployees[];
};

export class EmployeesDB extends TableDB<TEmployees, TableEmployees> {
  constructor() {
    super(employees);
  }

  getEmployees = async (params: TParams): Promise<TGetEmployeesDB> => {
    const { id, lastName, firstName, title, city, homePhone, country } = this.table;
    const { limit, offset } = params;
    const queryEmployeesPromise = this.db
      .select({ id, lastName, firstName, title, city, homePhone, country })
      .from(this.table)
      .limit(limit)
      .offset(offset);

    const maxDBElements = this.getMaxElementsCount(limit);

    const [length, queryEmployees] = await Promise.all([maxDBElements, queryEmployeesPromise]);
    const { sql: sqlString } = queryEmployeesPromise.toSQL();
    await this.logLastSqlQuery(sqlString);

    return { ...length, employees: queryEmployees };
  };
}
