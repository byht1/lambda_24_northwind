import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { OrdersService } from './orders.service';
import { TGetOrdersDB } from 'db/services/OrderDB.service';

interface IOrdersController {
  getOrders: TRouterFn<TGetOrdersDB, TQuery>;
  getOrderId: TRouterFn<any, void, { searchId: string }>;
}

export class OrdersController implements IOrdersController {
  constructor(private ordersService: OrdersService = new OrdersService()) {}

  getOrders: TRouterFn<TGetOrdersDB, TQuery> = async (req, res) => {
    const query = req.query;
    const orders = await this.ordersService.getOrders(query);

    return res.json(orders);
  };

  getOrderId: TRouterFn<any, void, { searchId: string }> = async (req, res) => {
    const { searchId } = req.params;
    const order = await this.ordersService.getOrderId(+searchId);

    return res.json(order);
  };
}
