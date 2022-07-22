import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { prisma } from '~/data';
import authConfig from '~/config/auth';
import { logger } from '~/utils/logger';

export const login = async (ctx) => {
    const { email, password } = ctx.request.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            ctx.status = 400;
            ctx.body = {
                message: 'Combinação de usuário/senha não corresponde.',
            };

            return;
        }

        const isPasswordEqual = await bcrypt.compare(password, user.password);

        if (!isPasswordEqual) {
            ctx.status = 400;
            ctx.body = {
                message: 'Combinação de usuário/senha não corresponde.',
            };

            return;
        }

        const token = jwt.sign({ sub: user.id }, authConfig.jwt.secret, {
            expiresIn: authConfig.jwt.expiresIn,
        });

        const responseUser = {
            ...user,
            password: null,
        };

        ctx.body = {
            user: responseUser,
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
