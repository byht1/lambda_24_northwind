import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger-docs.json';

const router = express.Router();

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocs));

export const swaggerRouter = router;
