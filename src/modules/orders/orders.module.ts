import express from 'express';
import { ctrlWrapper } from 'helpers';
import { validate } from 'middleware';
import { ordersQueryParamsDto } from 'modules/dto';
import { OrdersController } from './orders.controller';

const router = express.Router();
const breakpointName = 'orders';
const { getOrders } = new OrdersController();

router.get(`/${breakpointName}`, validate(ordersQueryParamsDto), ctrlWrapper(getOrders));

export const ordersRouter = router;
