import { Router } from 'express';
import uploadsRouter from '@Routes/uploads';

const routes = Router();

routes.use('/users', uploadsRouter);

export default routes;
