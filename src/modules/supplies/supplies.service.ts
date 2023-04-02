import { SuppliesDB, TGetProductsDB, TSupplierByIdResponse } from 'db/services/Supplies.service';
import { createError, notFoundMessage } from 'helpers';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface ISuppliesService {
  getSupplies: (...args: [TQuery]) => void;
}

export class SuppliesService implements ISuppliesService {
  constructor(private suppliesDB: SuppliesDB = new SuppliesDB()) {}

  getSupplies = async (query: TQuery): Promise<TGetProductsDB> => {
    const params = formatQueryParams(query);

    return this.suppliesDB.getSupplies(params);
  };

  getSupplierById = async (searchId: number): Promise<TSupplierByIdResponse> => {
    const supplier = await this.suppliesDB.getSupplierById(searchId);
    if (!supplier.supplier) {
      throw createError(404, notFoundMessage);
    }
    return supplier;
  };
}
