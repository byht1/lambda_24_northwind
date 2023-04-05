import { CalculateExecutionTime } from 'helpers';
import { TCalcPage } from '../type';
import { PgSelect } from 'drizzle-orm/pg-core';
import { GetSelectTableName } from 'drizzle-orm/query-builders/select.types';
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
import { SQL } from 'drizzle-orm/sql';

export type TMaxElementsCountResponse = TCalcPage & {
  sqlLog: CalculateExecutionTime;
};

export type TTable<T> = T extends
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

export type TCountPgSelect<T> = PgSelect<
  GetSelectTableName<TTable<T>>,
  {
    count: SQL<number>;
  },
  'partial',
  any
>;
