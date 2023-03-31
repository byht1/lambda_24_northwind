import { supplies, TableSupplies, TSupplies } from '../schema/supplies.schema';
import { TableDB, TParams } from './tableDB.service';

export class SuppliesDB extends TableDB<TSupplies, TableSupplies> {
  constructor() {
    super(supplies);
  }

  getSupplies = async (params: TParams) => this.getAllData(params);
}
