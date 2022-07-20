import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import { router } from './modules/routes';

const app = new Koa();

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

export { app };
