import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { SuppliesService } from './supplies.service';
import { TGetProductsDB } from 'db/services/Supplies.service';

interface ISuppliesController {
  getSupplies: TRouterFn<TGetProductsDB, TQuery>;
}

export class SuppliesController implements ISuppliesController {
  constructor(private suppliesService: SuppliesService = new SuppliesService()) {}

  getSupplies: TRouterFn<TGetProductsDB, TQuery> = async (req, res) => {
    const query = req.query;
    const supplies = await this.suppliesService.getSupplies(query);

    return res.json(supplies);
  };
}
