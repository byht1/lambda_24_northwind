import { TProducts } from 'db/schema/products.schema';
import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { ProductsService } from './products.service';

interface IProductsController {
  getProducts: TRouterFn<TProducts[], TQuery>;
}

export class ProductsController implements IProductsController {
  constructor(private productsService: ProductsService = new ProductsService()) {}

  getProducts: TRouterFn<TProducts[], TQuery> = async (req, res) => {
    const query = req.query;
    const products = await this.productsService.getProducts(query);

    return res.json(products);
  };
}
