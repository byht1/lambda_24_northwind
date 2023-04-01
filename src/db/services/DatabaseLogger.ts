import { join as pathJoin } from 'path';
import { writeFile, readFile } from 'fs/promises';
import { getEnv } from 'helpers';
import { PgSelect } from 'drizzle-orm/pg-core';
import { SelectMode } from 'drizzle-orm/query-builders/select.types';

export class DatabaseLogger {
  constructor(
    private databaseLogsPath = pathJoin(__dirname, '../../../repository/database_query_log.txt'),
    private countOfQueriesInLog = +getEnv('COUNT_OF_QUERIES_IN_LOG', '5') - 1
  ) {}

  getQueryHistory = async () => await readFile(this.databaseLogsPath, { encoding: 'utf8' });

  // Any тому що мене не цікавить що там я просто роблю лог запиту до бази даних
  getQueryStringAndLog = async (request: PgSelect<any, any, any>) => {
    const { sql } = request.toSQL();
    await this.logLastSqlQuery(sql);
  };

  private logLastSqlQuery = async (sqlQuery: string) => {
    const recentSqlQueries = await this.getQueryHistory();
    const recentSqlQueriesCorrecting = recentSqlQueries.split('\n');
    if (recentSqlQueriesCorrecting.length >= this.countOfQueriesInLog) {
      recentSqlQueriesCorrecting.shift();
    }
    const newSqlQuery = this.formatLogSqlQuery(sqlQuery);
    recentSqlQueriesCorrecting.push(newSqlQuery);

    await writeFile(this.databaseLogsPath, recentSqlQueriesCorrecting.join('\n'));
  };

  private formatLogSqlQuery = (sqlQuery: string) => {
    const logTime = this.logTime();

    return `${logTime} - ${sqlQuery}`;
  };

  private logTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  };
}
