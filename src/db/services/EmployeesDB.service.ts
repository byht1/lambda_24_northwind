import { employees, employeesFiles, TableEmployees, TEmployees } from 'db/schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';
import { CalculateExecutionTime } from 'helpers';
import { eq } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';

export type TGetEmployees = Pick<
  TEmployees,
  'id' | 'lastName' | 'firstName' | 'title' | 'city' | 'homePhone' | 'country' | 'employeeId'
>;

export type TGetEmployeesDB = TCalcPage & {
  sqlLog: CalculateExecutionTime[];
  employees: TGetEmployees[];
};

type TReportsTo = {
  employeeId: number;
  name: string;
};

type TEmployeesById = {
  id: string;
  title: string | null;
  titleOfCourtesy: string | null;
  birthDate: string | null;
  hireDate: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  homePhone: string | null;
  extension: number | null;
  notes: string | null;
  name: string;
  reportsTo: TReportsTo | null;
  employeeId: number;
};

export type TEmployeeDBResponse = {
  employee: TEmployeesById;
  sqlLog: CalculateExecutionTime[];
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

  getEmployeeById = async (searchId: number): Promise<TEmployeeDBResponse> => {
    const startTime = Date.now();
    const { employeeId, _, reportsTo, firstName, lastName, ...column } = this.table;
    const queryEmployeePromise = this.db
      .select({
        ...column,
        name: sql<string>`CONCAT(${firstName}, ' ', ${lastName})`,
        reportsTo: {
          employeeId: employeesFiles.employeeId,
          name: sql<string>`CONCAT(${employeesFiles.firstName}, ' ', ${employeesFiles.lastName})`,
        },
        employeeId,
      })
      .from(this.table)
      .leftJoin(employeesFiles, eq(employeesFiles.employeeId, reportsTo))
      .where(eq(employeeId, searchId));

    const definitionQueryStatement = this.getQueryStringAndLog(queryEmployeePromise);

    const [queryEmployee, sqlLogString] = await Promise.all([
      queryEmployeePromise,
      definitionQueryStatement,
    ]);

    return {
      employee: queryEmployee[0],
      sqlLog: [new CalculateExecutionTime(startTime, sqlLogString)],
    };
  };
}
