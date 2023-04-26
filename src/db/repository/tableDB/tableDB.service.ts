import { getDrizzle } from 'db/connectDB';
import { DatabaseLogger } from '../DatabaseLogger';
import { sql } from 'drizzle-orm';
import { CalculateExecutionTime } from 'helpers';
import { SubqueryWithSelection } from 'drizzle-orm/pg-core/subquery';
import { TCountPgSelect, TMaxElementsCountResponse, TTable } from './type';
import { PgSelect } from 'drizzle-orm/pg-core';

export class TableDB<D> extends DatabaseLogger {
  public columnsName: Array<keyof typeof this.table>;
  private startTime: number = Date.now();

  constructor(public table: TTable<D>, public db = getDrizzle()) {
    super();
    this.columnsName = Object.keys(this.table) as Array<keyof typeof this.table>;
  }

  protected fetchDataWithLog = async <
    M extends Promise<TMaxElementsCountResponse>,
    T extends PgSelect<any, any, any>
  >(
    maxDBElements: M,
    query: T,
    fieldName: string
  ) => {
    const startTime = Date.now();
    const definitionQueryStatement = this.getQueryStringAndLog(query);
    const [totalElementsAndPages, queryResponse, sqlLogString] = await Promise.all([
      maxDBElements,
      query,
      definitionQueryStatement,
    ]);

    const { sqlLog: sqlLogTotalElementsAndPages, ...elementAndPage } = totalElementsAndPages;
    const sqlLog = [
      new CalculateExecutionTime(startTime, sqlLogString),
      sqlLogTotalElementsAndPages,
    ];

    return { sqlLog, ...elementAndPage, [fieldName]: queryResponse };
  };

  protected sqGetMaxElementsCount = async <B = any>(
    sq: SubqueryWithSelection<B, 'sq'>,
    limit: number
  ): Promise<TMaxElementsCountResponse> => {
    this.restart();
    const maxDBElementsPromise = this.db
      .with(sq)
      .select({ count: sql<number>`count(*)`.mapWith(it => +it) })
      .from(sq);

    return await this.calcMaxElementCount(maxDBElementsPromise, limit);
  };

  protected getMaxElementsCount = async (limit: number): Promise<TMaxElementsCountResponse> => {
    this.restart();
    const maxDBElementsPromise = this.db
      .select({ count: sql<number>`count(*)`.mapWith(it => +it) })
      .from(this.table);

    return this.calcMaxElementCount(maxDBElementsPromise, limit);
  };

  private restart = () => (this.startTime = Date.now());

  private calcMaxElementCount = async (
    pgSelect: TCountPgSelect<D>,
    limit: number
  ): Promise<TMaxElementsCountResponse> => {
    const definitionQueryStatement = this.getQueryStringAndLog(pgSelect);
    const [maxDBElements, sqlLogString] = await Promise.all([pgSelect, definitionQueryStatement]);
    const totalElementsFromDB = maxDBElements[0].count;
    const maxPage = Math.ceil(totalElementsFromDB / limit);

    return {
      totalElementsFromDB,
      maxPage,
      sqlLog: new CalculateExecutionTime(this.startTime, sqlLogString),
    };
  };
}
