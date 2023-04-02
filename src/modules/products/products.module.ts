import express from 'express';
import { ctrlWrapper } from 'helpers';
import { validate } from 'middleware';
import { paramsIdDto, productsQueryParamsDto } from 'modules/dto';
import { ProductsController } from './products.controller';

const router = express.Router();
const breakpointName = 'products';
const { getProducts, getProductId } = new ProductsController();

router.get(`/${breakpointName}`, validate(productsQueryParamsDto), ctrlWrapper(getProducts));
router.get(
  `/${breakpointName}/:searchId`,
  validate(paramsIdDto, 'params'),
  ctrlWrapper(getProductId)
);

export const productsRouter = router;
