import express from 'express';
import { ctrlWrapper } from 'helpers';
import { validate } from 'middleware';
import { paramsIdIsNumberDto, productsQueryParamsDto } from 'modules/dto';
import { ProductsController } from './products.controller';

const router = express.Router();
const breakpointName = 'products';
const { getProducts, getProductId } = new ProductsController();

router.get(`/${breakpointName}`, validate(productsQueryParamsDto), ctrlWrapper(getProducts));
router.get(
  `/${breakpointName}/:searchId`,
  validate(paramsIdIsNumberDto, 'params'),
  ctrlWrapper(getProductId)
);

export const productsRouter = router;
