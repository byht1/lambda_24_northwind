import { TableEmployees, employees, employeesFiles } from 'db/schema';
import { TableDB } from '../tableDB/tableDB.service';
import { EmployeesAllFn, EmployeesOneByIdFn, IEmployeesRepository } from './type';
import { CalculateExecutionTime } from 'helpers';
import { sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm/expressions';

export class EmployeesRepository extends TableDB<TableEmployees> implements IEmployeesRepository {
  constructor() {
    super(employees);
  }

  getAll: EmployeesAllFn = async params => {
    const { id, lastName, firstName, title, city, homePhone, country, employeeId } = this.table;
    const { limit, offset } = params;
    const queryEmployeesPromise = this.db
      .select({
        id,
        title,
        city,
        homePhone,
        country,
        employeeId,
        name: sql<string>`CONCAT(${firstName}, ' ', ${lastName})`,
      })
      .from(this.table)
      .limit(limit)
      .offset(offset)
      .orderBy(firstName, lastName);

    const maxDBElements = this.getMaxElementsCount(limit);
    const { sqlLog, employees, ...elementAndPage } = await this.fetchDataWithLog(
      maxDBElements,
      queryEmployeesPromise,
      'employees'
    );

    return { sqlLog, ...elementAndPage, employees };
  };

  getOneById: EmployeesOneByIdFn = async searchId => {
    const startTime = Date.now();
    const { employeeId, reportsTo, firstName, lastName, _, ...column } = this.table;
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
