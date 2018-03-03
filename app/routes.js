import { Router } from 'express';
import MetaController from './controllers/meta.controller';
import TranslateController from './controllers/translate.controller';
import errorHandler from './middleware/error-handler';

const routes = new Router();

routes.get('/', MetaController.index);

// Translation
routes.get('/translate/:lang/:word', TranslateController.translate);

routes.use(errorHandler);

export default routes;
