import { orders, TableOrders, TOrders } from 'db/schema';
import { TableDB, TParams } from './tableDB.service';

export class OrderDB extends TableDB<TOrders, TableOrders> {
  constructor() {
    super(orders);
  }

  getOrders = async (params: TParams) => this.getAllData(params);
}
