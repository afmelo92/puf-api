import { prisma } from '~/data';

export async function findUserByEmail(email) {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
}
