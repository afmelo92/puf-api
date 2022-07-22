import Router from '@koa/router';

import * as users from '~/modules/users';
import * as authController from '~/modules/auth/controllers';

export const router = new Router();

// Users
router.get('/users', users.list);
router.get('/users/:id', users.show);
router.post('/users', users.create);
router.put('/users/:id', users.update);
router.delete('/users/:id', users.remove);

// Auth
router.post('/auth/login', authController.login);
