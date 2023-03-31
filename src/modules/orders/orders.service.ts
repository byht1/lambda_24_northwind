import { TOrders, TSupplies } from 'db/schema';
import { OrderDB } from 'db/services/OrderDB.service';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

export type TGetOrders = {
  totalPrice: number;
  quantity: number | null;
  id: string;
  orderId: number;
  productId: number | null;
  shippedDate: string | null;
  shipName: string;
  shipCountry: string;
  shipCity: string;
};

interface IOrdersService {
  getOrders: (...args: [TQuery]) => Promise<TGetOrders[]>;
}

export class OrdersService implements IOrdersService {
  constructor(private orderDB: OrderDB = new OrderDB()) {}

  async getOrders(query: TQuery): Promise<TGetOrders[]> {
    const params = formatQueryParams(query);
    const orders = await this.orderDB.getOrders(params);
    const updateDateOrders = orders.map(({ unitPrice, quantity, ...order }) => {
      const totalPrice = this.calcTotalPrise(unitPrice, quantity);
      return {
        ...order,
        totalPrice,
        quantity,
      };
    });

    return updateDateOrders;
  }

  private calcTotalPrise = (unitPrice: string | null, quantity: number | null) => {
    if (unitPrice && quantity) return +unitPrice * quantity;

    return 0;
  };
}
