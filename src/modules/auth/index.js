import jwt from 'jsonwebtoken';

import { prisma } from '~/data';
import authConfig from '~/config/auth';
import { logger } from '~/utils/logger';

export const login = async (ctx) => {
    const { email, password } = ctx.request.body;

    try {
        const user = await prisma.user.findFirst({
            where: {
                email,
                password,
            },
        });

        if (!user) {
            ctx.status = 400;
            ctx.body = {
                message: 'Combinação de usuário e senha não correspondem.',
            };

            return;
        }

        const token = jwt.sign({ sub: user.id }, authConfig.jwt.secret, {
            expiresIn: authConfig.jwt.expiresIn,
        });

        ctx.body = {
            user,
            token,
        };
    } catch (error) {
        logger.log({
            level: 'error',
            message: error,
        });

        ctx.status = 500;
        ctx.body = {
            message: 'Oops! Ocorreu um erro ao efetuar login.',
        };
        return;
    }
};
