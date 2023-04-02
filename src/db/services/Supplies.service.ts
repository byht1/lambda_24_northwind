import { eq } from 'drizzle-orm/expressions';
import { supplies, TableSupplies, TSupplies } from '../schema/supplies.schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';
import { CalculateExecutionTime } from 'helpers';

export type TGetSupplies = Pick<
  TSupplies,
  'id' | 'companyName' | 'contactTitle' | 'city' | 'country' | 'contactName' | 'supplierId'
>;

export type TGetProductsDB = TCalcPage & {
  sqlLog: CalculateExecutionTime[];
  supplies: TGetSupplies[];
};

export type TSupplierByIdResponse = {
  supplier: {
    id: string;
    supplierId: number;
    companyName: string;
    contactName: string;
    contactTitle: string;
    address: string;
    city: string;
    region: string | null;
    postalCode: string;
    country: string;
    phone: string;
    fax: string | null;
    homePage: string | null;
  };
  sqlLog: CalculateExecutionTime[];
};

export class SuppliesDB extends TableDB<TSupplies, TableSupplies> {
  constructor() {
    super(supplies);
  }

  getSupplies = async (params: TParams): Promise<TGetProductsDB> => {
    const startTime = Date.now();
    const { id, contactTitle, city, country, companyName, contactName, supplierId } = this.table;
    const { limit, offset } = params;
    const querySuppliesPromise = this.db
      .select({ id, companyName, contactTitle, city, country, contactName, supplierId })
      .from(this.table)
      .limit(limit)
      .offset(offset)
      .orderBy(companyName);

    const maxDBElements = this.getMaxElementsCount(limit);
    const definitionQueryStatement = this.getQueryStringAndLog(querySuppliesPromise);

    const [totalElementsAndPages, querySupplies, sqlLogString] = await Promise.all([
      maxDBElements,
      querySuppliesPromise,
      definitionQueryStatement,
    ]);

    const { sqlLog: sqlLogTotalElementsAndPages, ...elementAndPage } = totalElementsAndPages;
    const sqlLog = [
      new CalculateExecutionTime(startTime, sqlLogString),
      sqlLogTotalElementsAndPages,
    ];

    return { sqlLog, ...elementAndPage, supplies: querySupplies };
  };

  getSupplierById = async (searchId: number): Promise<TSupplierByIdResponse> => {
    const startTime = Date.now();
    const { supplierId } = this.table;
    const querySupplierPromise = this.db.select().from(this.table).where(eq(supplierId, searchId));
    const definitionQueryStatement = this.getQueryStringAndLog(querySupplierPromise);

    const [querySupplies, sqlLogString] = await Promise.all([
      querySupplierPromise,
      definitionQueryStatement,
    ]);

    return {
      supplier: querySupplies[0],
      sqlLog: [new CalculateExecutionTime(startTime, sqlLogString)],
    };
  };
}
