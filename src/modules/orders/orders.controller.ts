import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { OrdersService, TGetOrders } from './orders.service';

interface IOrdersController {
  getOrders: TRouterFn<TGetOrders[], TQuery>;
}

export class OrdersController implements IOrdersController {
  constructor(private ordersService: OrdersService = new OrdersService()) {}

  getOrders: TRouterFn<TGetOrders[], TQuery> = async (req, res) => {
    const query = req.query;
    const orders = await this.ordersService.getOrders(query);

    return res.json(orders);
  };
}
