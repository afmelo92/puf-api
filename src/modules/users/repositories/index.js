import { prisma } from '~/data';

import * as HashService from '~/modules/auth/services/HashService';

export async function listAllUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
        },
    });
}

export async function findUserById(id) {
    return prisma.user.findFirst({
        where: {
            id,
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
        },
    });
}

export async function findUserByEmail(email) {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}

export async function createUser({ name = '', email, password }) {
    const hashedPassword = await HashService.hash(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
}

export async function updateUser({ id, data }) {
    return prisma.user.update({
        where: {
            id,
        },
        data,
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function removeUserById(id) {
    return prisma.user.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}
