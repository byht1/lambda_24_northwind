import { TableSupplies, supplies } from 'db/schema';
import { TableDB } from '../tableDB/tableDB.service';
import { ISuppliesRepository, SuppliesAllFn, SuppliesOneByIdFn } from './type';
import { CalculateExecutionTime } from 'helpers';
import { eq } from 'drizzle-orm/expressions';

export class SuppliesRepository extends TableDB<TableSupplies> implements ISuppliesRepository {
  constructor() {
    super(supplies);
  }

  getAll: SuppliesAllFn = async params => {
    const { id, contactTitle, city, country, companyName, contactName, supplierId } = this.table;
    const { limit, offset } = params;
    const querySuppliesPromise = this.db
      .select({ id, companyName, contactTitle, city, country, contactName, supplierId })
      .from(this.table)
      .limit(limit)
      .offset(offset)
      .orderBy(companyName);

    const maxDBElements = this.getMaxElementsCount(limit);
    const { sqlLog, supplies, ...elementAndPage } = await this.fetchDataWithLog(
      maxDBElements,
      querySuppliesPromise,
      'supplies'
    );

    return { sqlLog, ...elementAndPage, supplies };
  };

  getOneById: SuppliesOneByIdFn = async searchId => {
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
