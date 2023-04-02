import express from 'express';
import { ctrlWrapper } from 'helpers';
import { validate } from 'middleware';
import { ordersQueryParamsDto, paramsIdDto } from 'modules/dto';
import { OrdersController } from './orders.controller';

const router = express.Router();
const breakpointName = 'orders';
const { getOrders, getOrderId } = new OrdersController();

router.get(`/${breakpointName}`, validate(ordersQueryParamsDto), ctrlWrapper(getOrders));
router.get(
  `/${breakpointName}/:searchId`,
  validate(paramsIdDto, 'params'),
  ctrlWrapper(getOrderId)
);

export const ordersRouter = router;
