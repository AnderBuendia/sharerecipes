import { Router } from 'express';
import uploadRouter from '@Routes/upload';

const routes = Router();

routes.use('/upload', uploadRouter);

export default routes;
