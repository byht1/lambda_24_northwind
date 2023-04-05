import { TRouterFn } from 'type';
import { SearchService, TFindResponse } from './search.service';

export type TQuerySearch = {
  field: 'string';
  searchValue: 'string';
  page: 'string';
  limit: 'string';
  table: 'customers' | 'products';
};

interface IProductsController {
  getFind: TRouterFn<TFindResponse, TQuerySearch>;
}

export class SearchController implements IProductsController {
  constructor(private searchService: SearchService = new SearchService()) {}

  getFind: TRouterFn<TFindResponse, TQuerySearch> = async (req, res) => {
    const data = await this.searchService.getFind(req.query);
    return res.json(data);
  };
}
