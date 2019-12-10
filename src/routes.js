import { Router } from 'express';

import UserController from './app/controllers/UserController';
import StudentsController from './app/controllers/StudentsController';
import PlanController from './app/controllers/PlanController';
import SessionController from './app/controllers/SessionController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

//Checkins
routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

//Pedidos de auxílio

routes.post('/students/:id/help-orders', HelpOrderController.store);


//Autenticação
routes.use(authMiddleware);

routes.put('/users', UserController.update);

//Alunos
routes.get('/students/:id', StudentsController.index);
routes.get('/students/:nome', StudentsController.index);
routes.get('/students', StudentsController.index);
routes.post('/students', StudentsController.store);
routes.put('/students/:id', StudentsController.update);
routes.delete('/students/:id', StudentsController.delete);

//Planos
routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.destroy);

//Matrículas
routes.get('/registrations', RegistrationController.index);
routes.get('/registrations/:id', RegistrationController.index);
routes.post('/registrations', RegistrationController.store);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.destroy);

//Pedidos de auxílio
routes.get('/help', HelpOrderController.index);
routes.get('/help/:id', HelpOrderController.index);
routes.put('/help/:id', HelpOrderController.update);
export default routes;
