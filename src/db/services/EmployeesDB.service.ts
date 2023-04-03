import { employees, TableEmployees, TEmployees } from 'db/schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';
import { CalculateExecutionTime } from 'helpers';

export type TGetEmployees = Pick<
  TEmployees,
  'id' | 'lastName' | 'firstName' | 'title' | 'city' | 'homePhone' | 'country' | 'employeeId'
>;

export type TGetEmployeesDB = TCalcPage & {
  sqlLog: CalculateExecutionTime[];
  employees: TGetEmployees[];
};

export class EmployeesDB extends TableDB<TEmployees, TableEmployees> {
  constructor() {
    super(employees);
  }

  getEmployees = async (params: TParams): Promise<TGetEmployeesDB> => {
    const startTime = Date.now();
    const { id, lastName, firstName, title, city, homePhone, country, employeeId } = this.table;
    const { limit, offset } = params;
    const queryEmployeesPromise = this.db
      .select({ id, lastName, firstName, title, city, homePhone, country, employeeId })
      .from(this.table)
      .limit(limit)
      .offset(offset)
      .orderBy(firstName, lastName);

    const maxDBElements = this.getMaxElementsCount(limit);
    const definitionQueryStatement = this.getQueryStringAndLog(queryEmployeesPromise);

    const [totalElementsAndPages, queryEmployees, sqlLogString] = await Promise.all([
      maxDBElements,
      queryEmployeesPromise,
      definitionQueryStatement,
    ]);

    const { sqlLog: sqlLogTotalElementsAndPages, ...elementAndPage } = totalElementsAndPages;
    const sqlLog = [
      new CalculateExecutionTime(startTime, sqlLogString),
      sqlLogTotalElementsAndPages,
    ];

    return { sqlLog, ...elementAndPage, employees: queryEmployees };
  };
}
