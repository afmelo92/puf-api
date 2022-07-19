import * as bcrypt from 'bcrypt';

import { prisma } from '~/data';
import { logger } from '~/utils/logger';

export const list = async (ctx) => {
    try {
        const users = await prisma.user.findMany();

        ctx.body = users;
    } catch (error) {
        logger.log({
            level: 'error',
            message: error,
        });

        ctx.status = 500;
        ctx.body = 'Oops! Ocorreu um erro ao obter usuários.';
        return;
    }
};

export const show = async (ctx) => {
    const { id } = ctx.request.params;

    try {
        const user = await prisma.user.findFirst({
            where: {
                id,
            },
        });

        ctx.body = user;
    } catch (error) {
        logger.log({
            level: 'error',
            message: error,
        });

        ctx.status = 500;
        ctx.body = 'Oops! Ocorreu um erro ao obter o usuário.';
        return;
    }
};

export const create = async (ctx) => {
    const { name, email, password } = ctx.request.body;

    const hashSalt = 8;

    const hashedPassword = await bcrypt.hash(password, hashSalt);

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        ctx.status = 201;
        ctx.body = user;
    } catch (error) {
        logger.log({
            level: 'error',
            message: error,
        });

        ctx.status = 500;
        ctx.body = 'Oops! Ocorreu um erro ao criar o usuário.';
        return;
    }
};

export const update = async (ctx) => {
    const { id } = ctx.request.params;
    const { name, email, password } = ctx.request.body;
    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                name,
                email,
                password,
            },
        });

        ctx.body = user;
    } catch (error) {
        logger.log({
            level: 'error',
            message: error,
        });

        ctx.status = 500;
        ctx.body = 'Oops! Ocorreu um erro ao atualizar o usuário.';
        return;
    }
};

export const remove = async (ctx) => {
    const { id } = ctx.request.params;
    try {
        const user = await prisma.user.delete({
            where: {
                id,
            },
        });

        ctx.body = user;
    } catch (error) {
        logger.log({
            level: 'error',
            message: error,
        });

        ctx.status = 500;
        ctx.body = 'Oops! Ocorreu um erro ao deletar o usuário.';
        return;
    }
};
