import { customers, TableCustomers, TCustomers } from 'db/schema';
import { TableDB, TParams } from './tableDB.service';

export class CustomersDB extends TableDB<TCustomers, TableCustomers> {
  constructor() {
    super(customers);
  }

  getCustomers = async (params: TParams) => this.getAllData(params);
}
