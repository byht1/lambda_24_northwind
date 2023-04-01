import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { OrdersService } from './orders.service';
import { TGetOrdersDB } from 'db/services/OrderDB.service';

interface IOrdersController {
  getOrders: TRouterFn<TGetOrdersDB, TQuery>;
}

export class OrdersController implements IOrdersController {
  constructor(private ordersService: OrdersService = new OrdersService()) {}

  getOrders: TRouterFn<TGetOrdersDB, TQuery> = async (req, res) => {
    const query = req.query;
    const orders = await this.ordersService.getOrders(query);

    return res.json(orders);
  };
}
