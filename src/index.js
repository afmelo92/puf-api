import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import winston from 'winston';

import { logger } from './utils/logger';

const app = new Koa();

import { router } from './modules/routes';

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.errors({ stack: true }),
                winston.format.timestamp(),
                winston.format.prettyPrint()
            ),
        })
    );
}

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.SERVER_PORT);
