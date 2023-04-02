import express from 'express';
import { ctrlWrapper } from 'helpers';
import { validate } from 'middleware';
import { paramsIdIsNumberDto, suppliesQueryParamsDto } from 'modules/dto';
import { SuppliesController } from './supplies.controller';

const router = express.Router();
const breakpointName = 'supplies';
const { getSupplies, getSupplierId } = new SuppliesController();

router.get(`/${breakpointName}`, validate(suppliesQueryParamsDto), ctrlWrapper(getSupplies));
router.get(
  `/${breakpointName}/:searchId`,
  validate(paramsIdIsNumberDto, 'params'),
  ctrlWrapper(getSupplierId)
);

export const suppliesRouter = router;
