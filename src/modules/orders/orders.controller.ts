import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { TOrders } from 'db/schema';
import { OrdersService } from './orders.service';

interface IOrdersController {
  getOrders: TRouterFn<TOrders[], TQuery>;
}

export class OrdersController implements IOrdersController {
  constructor(private ordersService: OrdersService = new OrdersService()) {}

  getOrders: TRouterFn<TOrders[], TQuery> = async (req, res) => {
    const query = req.query;
    const orders = await this.ordersService.getOrders(query);

    return res.json(orders);
  };
}
