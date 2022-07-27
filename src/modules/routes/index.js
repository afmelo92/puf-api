import Router from '@koa/router';

import * as usersControllers from '~/modules/users/controllers';
import * as authController from '~/modules/auth/controllers';

export const router = new Router();

// Users
router.get('/users', usersControllers.list);
router.get('/users/:id', usersControllers.show);
router.post('/users', usersControllers.create);
router.put('/users/:id', usersControllers.update);
router.delete('/users/:id', usersControllers.remove);

// Auth
router.post('/auth/login', authController.login);
