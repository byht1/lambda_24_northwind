import { TSupplies } from 'db/schema';
import { SuppliesDB, TGetProductsDB, TSupplierByIdResponse } from 'db/services/Supplies.service';
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
    return await this.suppliesDB.getSupplierById(searchId);
  };
}
