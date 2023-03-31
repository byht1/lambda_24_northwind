import { employees, TableEmployees, TEmployees } from 'db/schema';
import { TableDB, TParams } from './tableDB.service';

export type TGetEmployeesDB = Pick<
  TEmployees,
  'id' | 'lastName' | 'firstName' | 'title' | 'city' | 'homePhone' | 'country'
>;

export class EmployeesDB extends TableDB<TEmployees, TableEmployees> {
  constructor() {
    super(employees);
  }

  getEmployees = async (params: TParams): Promise<TGetEmployeesDB[]> => {
    const { id, lastName, firstName, title, city, homePhone, country } = this.table;
    const { limit, offset } = params;
    const query = this.db
      .select({ id, lastName, firstName, title, city, homePhone, country })
      .from(this.table)
      .limit(limit)
      .offset(offset);

    const { sql } = query.toSQL();
    await this.logLastSqlQuery(sql);

    return query;
  };
}
