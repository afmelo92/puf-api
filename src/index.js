import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

const app = new Koa();

import { router } from './modules/routes';

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.SERVER_PORT || 9001);
