import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { SuppliesService } from './supplies.service';
import { TGetSupplies } from 'db/services/Supplies.service';

interface ISuppliesController {
  getSupplies: TRouterFn<TGetSupplies[], TQuery>;
}

export class SuppliesController implements ISuppliesController {
  constructor(private suppliesService: SuppliesService = new SuppliesService()) {}

  getSupplies: TRouterFn<TGetSupplies[], TQuery> = async (req, res) => {
    const query = req.query;
    const supplies = await this.suppliesService.getSupplies(query);

    return res.json(supplies);
  };
}
