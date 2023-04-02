import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { ProductsService } from './products.service';
import { TGetProductsDB } from 'db/services/ProductDB.service';

interface IProductsController {
  getProducts: TRouterFn<TGetProductsDB, TQuery>;
  getProductId: TRouterFn<any, void, any>;
}

export class ProductsController implements IProductsController {
  constructor(private productsService: ProductsService = new ProductsService()) {}

  getProducts: TRouterFn<TGetProductsDB, TQuery> = async (req, res) => {
    const query = req.query;
    const products = await this.productsService.getProducts(query);

    return res.json(products);
  };

  getProductId: TRouterFn<any, void, any> = async (req, res) => {
    const { searchId } = req.params;
    const product = await this.productsService.getProductById(+searchId);
    return res.json(product);
  };
}
