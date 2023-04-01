import { supplies, TableSupplies, TSupplies } from '../schema/supplies.schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';

export type TGetSupplies = Pick<
  TSupplies,
  'id' | 'companyName' | 'contactTitle' | 'city' | 'country' | 'contactName'
>;

export type TGetProductsDB = TCalcPage & {
  supplies: TGetSupplies[];
};

export class SuppliesDB extends TableDB<TSupplies, TableSupplies> {
  constructor() {
    super(supplies);
  }

  getSupplies = async (params: TParams): Promise<TGetProductsDB> => {
    const { id, contactTitle, city, country, companyName, contactName } = this.table;
    const { limit, offset } = params;
    const querySuppliesPromise = this.db
      .select({ id, companyName, contactTitle, city, country, contactName })
      .from(this.table)
      .limit(limit)
      .offset(offset);

    const maxDBElements = this.getMaxElementsCount(limit);
    const definitionQueryStatement = this.getQueryStringAndLog(querySuppliesPromise);

    const [totalElementsAndPages, querySupplies] = await Promise.all([
      maxDBElements,
      querySuppliesPromise,
      definitionQueryStatement,
    ]);

    return { ...totalElementsAndPages, supplies: querySupplies };
  };
}
