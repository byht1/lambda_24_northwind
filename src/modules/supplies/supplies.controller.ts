import { TParamsId, TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { SuppliesService } from './supplies.service';
import { TGetProductsDB, TSupplierByIdResponse } from 'db/services/Supplies.service';

interface ISuppliesController {
  getSupplies: TRouterFn<TGetProductsDB, TQuery>;
  getSupplierId: TRouterFn<TSupplierByIdResponse, void, TParamsId>;
}

export class SuppliesController implements ISuppliesController {
  constructor(private suppliesService: SuppliesService = new SuppliesService()) {}

  getSupplies: TRouterFn<TGetProductsDB, TQuery> = async (req, res) => {
    const query = req.query;
    const supplies = await this.suppliesService.getSupplies(query);

    return res.json(supplies);
  };

  getSupplierId: TRouterFn<TSupplierByIdResponse, void, TParamsId> = async (req, res) => {
    const { searchId } = req.params;
    const supplier = await this.suppliesService.getSupplierById(+searchId);
    return res.json(supplier);
  };
}
