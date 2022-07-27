import winston from 'winston';

export const logger = winston.createLogger();

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
} else {
    logger.add(
        new winston.transports.File({
            filename: './logs/application.log',
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.timestamp(),
                winston.format.json()
            ),
        })
    );
}
