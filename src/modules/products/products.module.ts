import express from 'express';
import { ctrlWrapper } from 'helpers';
import { validate } from 'middleware';
import { productsQueryParamsDto } from 'modules/dto';
import { ProductsController } from './products.controller';

const router = express.Router();
const breakpointName = 'products';
const { getProducts } = new ProductsController();

router.get(`/${breakpointName}`, validate(productsQueryParamsDto), ctrlWrapper(getProducts));

export const productsRouter = router;
