import { TSupplies } from 'db/schema';
import { SuppliesDB } from 'db/services/Supplies.service';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface ISuppliesService {
  getSupplies: (...args: [TQuery]) => void;
}

export class SuppliesService implements ISuppliesService {
  constructor(private suppliesDB: SuppliesDB = new SuppliesDB()) {}

  async getSupplies(query: TQuery): Promise<TSupplies[]> {
    const params = formatQueryParams(query);

    return this.suppliesDB.getSupplies(params);
  }
}
