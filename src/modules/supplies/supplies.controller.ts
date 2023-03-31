import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { SuppliesService } from './supplies.service';
import { TSupplies } from 'db/schema';

interface ISuppliesController {
  getSupplies: TRouterFn<TSupplies[], TQuery>;
}

export class SuppliesController implements ISuppliesController {
  constructor(private suppliesService: SuppliesService = new SuppliesService()) {}

  getSupplies: TRouterFn<TSupplies[], TQuery> = async (req, res) => {
    const query = req.query;
    const supplies = await this.suppliesService.getSupplies(query);

    return res.json(supplies);
  };
}
