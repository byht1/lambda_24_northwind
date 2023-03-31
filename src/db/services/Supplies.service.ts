import { supplies, TableSupplies, TSupplies } from '../schema/supplies.schema';
import { TableDB, TParams } from './tableDB.service';

export type TGetSupplies = Pick<
  TSupplies,
  'id' | 'companyName' | 'contactTitle' | 'city' | 'country' | 'contactName'
>;

export class SuppliesDB extends TableDB<TSupplies, TableSupplies> {
  constructor() {
    super(supplies);
  }

  getSupplies = async (params: TParams): Promise<TGetSupplies[]> => {
    const { id, contactTitle, city, country, companyName, contactName } = this.table;
    const { limit, offset } = params;
    const query = this.db
      .select({ id, companyName, contactTitle, city, country, contactName })
      .from(this.table)
      .limit(limit)
      .offset(offset);

    const { sql } = query.toSQL();
    await this.logLastSqlQuery(sql);

    return query;
  };
}
