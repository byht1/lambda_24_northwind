import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { ProductsService } from './products.service';
import { TGetProducts } from 'db/services/ProductDB.service';

interface IProductsController {
  getProducts: TRouterFn<TGetProducts[], TQuery>;
}

export class ProductsController implements IProductsController {
  constructor(private productsService: ProductsService = new ProductsService()) {}

  getProducts: TRouterFn<TGetProducts[], TQuery> = async (req, res) => {
    const query = req.query;
    const products = await this.productsService.getProducts(query);

    return res.json(products);
  };
}
