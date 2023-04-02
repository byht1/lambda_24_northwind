import { TParamsId, TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { ProductsService } from './products.service';
import { TGetProductByIdResponseDB, TGetProductsDB } from 'db/services/ProductDB.service';

interface IProductsController {
  getProducts: TRouterFn<TGetProductsDB, TQuery>;
  getProductId: TRouterFn<TGetProductByIdResponseDB, void, TParamsId>;
}

export class ProductsController implements IProductsController {
  constructor(private productsService: ProductsService = new ProductsService()) {}

  getProducts: TRouterFn<TGetProductsDB, TQuery> = async (req, res) => {
    const query = req.query;
    const products = await this.productsService.getProducts(query);

    return res.json(products);
  };

  getProductId: TRouterFn<TGetProductByIdResponseDB, void, TParamsId> = async (req, res) => {
    const { searchId } = req.params;
    const product = await this.productsService.getProductById(+searchId);
    return res.json(product);
  };
}
