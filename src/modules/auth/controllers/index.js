import { logger } from '~/utils/logger';
import * as UsersRepository from '~/modules/users/repositories';
import * as HashService from '~/modules/auth/services/HashService';
import * as TokenService from '~/modules/auth/services/TokenService';

export const login = async (ctx) => {
    const { email, password } = ctx.request.body;

    try {
        if (!email || !password) {
            ctx.status = 400;
            ctx.body = {
                message: 'E-mail e senha obrigatórios.',
            };

            return;
        }

        const user = await UsersRepository.findUserByEmail(email);

        if (!user) {
            ctx.status = 400;
            ctx.body = {
                message: 'Combinação de usuário/senha não corresponde.',
            };

            return;
        }

        const isPasswordEqual = await HashService.compare(
            password,
            user.password
        );

        if (!isPasswordEqual) {
            ctx.status = 400;
            ctx.body = {
                message: 'Combinação de usuário/senha não corresponde.',
            };

            return;
        }

        const jwtPayload = { sub: user.id };

        const token = TokenService.generate(jwtPayload);

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
