import { SuppliesRepository, TSuppliesAllRes, TSuppliesOneByIdRes } from 'db/repository';
import { createError, notFoundMessage } from 'helpers';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface ISuppliesService {
  getSupplies: (...args: [TQuery]) => Promise<TSuppliesAllRes>;
  getSupplierById: (...args: [number]) => Promise<TSuppliesOneByIdRes>;
}

export class SuppliesService implements ISuppliesService {
  constructor(private suppliesDB: SuppliesRepository = new SuppliesRepository()) {}

  getSupplies = async (query: TQuery): Promise<TSuppliesAllRes> => {
    const params = formatQueryParams(query);

    return this.suppliesDB.getAll(params);
  };

  getSupplierById = async (searchId: number): Promise<TSuppliesOneByIdRes> => {
    const supplier = await this.suppliesDB.getOneById(searchId);
    if (!supplier.supplier) {
      throw createError(404, notFoundMessage);
    }
    return supplier;
  };
}
