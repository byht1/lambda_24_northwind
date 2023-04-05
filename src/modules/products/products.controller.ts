import { TParamsId, TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { ProductsService } from './products.service';
import { TProductsAllRes, TProductsOneByIdRes } from 'db/repository';

interface IProductsController {
  getProducts: TRouterFn<TProductsAllRes, TQuery>;
  getProductId: TRouterFn<TProductsOneByIdRes, void, TParamsId>;
}

export class ProductsController implements IProductsController {
  constructor(private productsService: ProductsService = new ProductsService()) {}

  getProducts: TRouterFn<TProductsAllRes, TQuery> = async (req, res) => {
    const query = req.query;
    const products = await this.productsService.getProducts(query);

    return res.json(products);
  };

  getProductId: TRouterFn<TProductsOneByIdRes, void, TParamsId> = async (req, res) => {
    const { searchId } = req.params;
    const product = await this.productsService.getProductById(+searchId);
    return res.json(product);
  };
}
