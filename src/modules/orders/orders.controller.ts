import { TParamsId, TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { OrdersService, TOrderById } from './orders.service';
import { TOrdersAllRes } from 'db/repository';

interface IOrdersController {
  getOrders: TRouterFn<TOrdersAllRes, TQuery>;
  getOrderId: TRouterFn<TOrderById, void, TParamsId>;
}

export class OrdersController implements IOrdersController {
  constructor(private ordersService: OrdersService = new OrdersService()) {}

  getOrders: TRouterFn<TOrdersAllRes, TQuery> = async (req, res) => {
    const query = req.query;
    const orders = await this.ordersService.getOrders(query);

    return res.json(orders);
  };

  getOrderId: TRouterFn<TOrderById, void, TParamsId> = async (req, res) => {
    const { searchId } = req.params;
    const order = await this.ordersService.getOrderId(+searchId);

    return res.json(order);
  };
}
