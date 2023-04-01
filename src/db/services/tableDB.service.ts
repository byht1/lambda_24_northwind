import { join as pathJoin } from 'path';
import { writeFile, readFile } from 'fs/promises';
import { connect } from 'db/connectDB';
import {
  TableCategories,
  TableCustomers,
  TableEmployees,
  TableEmployeesTerritories,
  TableOrderDetails,
  TableOrders,
  TableProducts,
  TableRegions,
  TableShippers,
  TableSupplies,
  TableTerritories,
} from 'db/schema';
import { DatabaseLogger } from './DatabaseLogger';
import { sql } from 'drizzle-orm';

export type TParams = {
  offset: number;
  limit: number;
};

type TTable<T> = T extends
  | TableCategories
  | TableCustomers
  | TableEmployees
  | TableEmployeesTerritories
  | TableOrderDetails
  | TableOrders
  | TableProducts
  | TableRegions
  | TableShippers
  | TableSupplies
  | TableTerritories
  ? T
  : never;

export type TCalcPage = {
  length: number;
  maxPage: number;
};

export class TableDB<T, D> extends DatabaseLogger {
  public columnsName: Array<keyof typeof this.table>;

  constructor(public table: TTable<D>, public db = connect()) {
    super();
    this.columnsName = Object.keys(this.table) as Array<keyof typeof this.table>;
  }

  getMaxElementsCount = async (limit: number): Promise<TCalcPage> => {
    const maxDBElements = await this.db
      .select({ count: sql<string>`count(*)`.mapWith(it => +it) })
      .from(this.table);
    const length = maxDBElements[0].count;
    const maxPage = length / limit;

    return { length, maxPage };
  };
}
