import { logger } from '~/utils/logger';

import * as UsersRepository from '~/modules/users/repositories';

export const list = async (ctx) => {
    try {
        const users = await UsersRepository.listAllUsers();

        ctx.body = {
            users,
        };
    } catch (error) {
        logger.log({
            level: 'error',
            message: error,
        });

        ctx.status = 500;
        ctx.body = {
            message: 'Oops! Ocorreu um erro ao obter usuários.',
        };
        return;
    }
};

export const show = async (ctx) => {
    const { id } = ctx.request.params;

    try {
        const user = await UsersRepository.findUserById(id);

        ctx.body = {
            user,
        };
    } catch (error) {
        logger.log({
            level: 'error',
            message: error,
        });

        ctx.status = 500;
        ctx.body = {
            message: 'Oops! Ocorreu um erro ao obter o usuário.',
        };
        return;
    }
};

export const create = async (ctx) => {
    const { name, email, password } = ctx.request.body;

    try {
        if (!email || !password) {
            ctx.status = 400;
            ctx.body = {
                message: 'E-mail e senha obrigatórios.',
            };

            return;
        }

        const user = await UsersRepository.createUser({
            name,
            email,
            password,
        });

        ctx.status = 201;
        ctx.body = {
            user,
        };
    } catch (error) {
        logger.log({
            level: 'error',
            message: error,
        });

        ctx.status = 500;
        ctx.body = {
            message: 'Oops! Ocorreu um erro ao criar o usuário.',
        };
        return;
    }
};

export const update = async (ctx) => {
    const { id } = ctx.request.params;
    const { name, email, password, deletedAt } = ctx.request.body;

    try {
        if (email) {
            const isEmailAlreadyUsed = await UsersRepository.findUserByEmail(
                email
            );

            if (isEmailAlreadyUsed && isEmailAlreadyUsed.id !== id) {
                ctx.status = 400;
                ctx.body = {
                    message: 'E-mail já utilizado.',
                };

                return;
            }
        }

        const user = await UsersRepository.updateUser({
            id,
            data: {
                name,
                email,
                password,
                deletedAt,
            },
        });

        ctx.body = {
            user,
        };
    } catch (error) {
        logger.log({
            level: 'error',
            message: error,
        });

        ctx.status = 500;
        ctx.body = {
            message: 'Oops! Ocorreu um erro ao atualizar o usuário.',
        };
        return;
    }
};

export const remove = async (ctx) => {
    const { id } = ctx.request.params;

    try {
        const checkDeletedAt = await UsersRepository.findUserById(id);

        if (checkDeletedAt.deletedAt) {
            ctx.status = 400;
            ctx.body = {
                message: 'Usuário já removido.',
            };

            return;
        }

        const user = await UsersRepository.removeUserById(id);

        ctx.body = {
            user,
        };
    } catch (error) {
        logger.log({
            level: 'error',
            message: error,
        });

        ctx.status = 500;
        ctx.body = {
            message: 'Oops! Ocorreu um erro ao deletar o usuário.',
        };
        return;
    }
};
