import { TParamsId, TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { SuppliesService } from './supplies.service';
import { TSuppliesAllRes, TSuppliesOneByIdRes } from 'db/repository';

interface ISuppliesController {
  getSupplies: TRouterFn<TSuppliesAllRes, TQuery>;
  getSupplierId: TRouterFn<TSuppliesOneByIdRes, void, TParamsId>;
}

export class SuppliesController implements ISuppliesController {
  constructor(private suppliesService: SuppliesService = new SuppliesService()) {}

  getSupplies: TRouterFn<TSuppliesAllRes, TQuery> = async (req, res) => {
    const query = req.query;
    const supplies = await this.suppliesService.getSupplies(query);

    return res.json(supplies);
  };

  getSupplierId: TRouterFn<TSuppliesOneByIdRes, void, TParamsId> = async (req, res) => {
    const { searchId } = req.params;
    const supplier = await this.suppliesService.getSupplierById(+searchId);
    return res.json(supplier);
  };
}
