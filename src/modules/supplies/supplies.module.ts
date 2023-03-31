import express from 'express';
import { ctrlWrapper } from 'helpers';
import { validate } from 'middleware';
import { suppliesQueryParamsDto } from 'modules/dto';
import { SuppliesController } from './supplies.controller';

const router = express.Router();
const breakpointName = 'supplies';
const { getSupplies } = new SuppliesController();

router.get(`/${breakpointName}`, validate(suppliesQueryParamsDto), ctrlWrapper(getSupplies));

export const suppliesRouter = router;
