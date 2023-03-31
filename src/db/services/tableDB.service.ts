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

type TSelect = {
  pickSelect?: string[];
  omitSelect?: string[];
};

export type TParams = {
  offset: number;
  limit: number;
  select: TSelect;
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

export class TableDB<T, D> extends DatabaseLogger {
  public columnsName: Array<keyof typeof this.table>;

  constructor(public table: TTable<D>, public db = connect()) {
    super();
    this.columnsName = Object.keys(this.table) as Array<keyof typeof this.table>;
  }

  async getAllData(params: TParams): Promise<Array<T>> {
    const { limit, offset, select } = params;
    const column = this.selectColumn(select);
    const query = this.db.select(column).from(this.table).limit(limit).offset(offset);

    const { sql } = query.toSQL();
    await this.logLastSqlQuery(sql);

    return query as unknown as Array<T>;
  }

  // Повертаю any так як drizzle не дає можливості розширити тип PgSelectBuilder або я не знайшов((
  private selectColumn = ({ omitSelect, pickSelect }: TSelect) => {
    if (omitSelect) {
      return this.columnsName.reduce<any>((acc, column) => {
        if (omitSelect.includes(column as string)) return acc;
        // if(this.columnsName)
        acc[column] = this.table[column];
        return acc;
      }, {});
    }

    if (pickSelect) {
      return this.columnsName.reduce<any>((acc, column) => {
        if (!pickSelect.includes(column as string)) return acc;
        acc[column] = this.table[column];
        return acc;
      }, {});
    }

    return this.columnsName.reduce<any>((acc, column) => {
      acc[column] = this.table[column];
      return acc;
    }, {});
  };
}

// repository
