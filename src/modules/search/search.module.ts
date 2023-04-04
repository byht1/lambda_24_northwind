import express from 'express';
import { ctrlWrapper } from 'helpers';
import { validate } from 'middleware';
import { SearchController } from './search.controller';
import { searchDto } from './dto';

const router = express.Router();
const breakpointName = 'search';
const { getFind } = new SearchController();

router.get(`/${breakpointName}`, validate(searchDto), ctrlWrapper(getFind));
export const searchRouter = router;
