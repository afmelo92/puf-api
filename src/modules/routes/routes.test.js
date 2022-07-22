import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '~/data';
import { app } from '~/server';

let server = app.listen();

let testUser;

const testUserData = {
    name: 'John Doe',
    email: 'john@email.com',
    password: '123456',
};

beforeAll(async () => {
    const hashedPassword = await bcrypt.hash(testUserData.password, 8);

    testUser = await prisma.user.create({
        data: {
            ...testUserData,
            password: hashedPassword,
        },
    });
});

afterAll(async () => {
    await server.close();

    await prisma.user.delete({
        where: {
            id: testUser.id,
        },
    });
});

describe('Auth routes', () => {
    // LOGIN
    it('should return 400 when no email or no password are sent', async () => {
        const email = '';
        const password = '';

        const response = await request(server).post('/auth/login').send({
            email,
            password,
        });

        expect(response.status).toEqual(400);
    });

    it('should return 400 when wrong email is sent', async () => {
        const email = 'wrong@email';
        const password = 'wrong-password';

        const response = await request(server).post('/auth/login').send({
            email,
            password,
        });

        expect(response.status).toEqual(400);
    });

    it('should return 400 when wrong password is sent', async () => {
        const email = testUserData.email;
        const password = 'wrong-password';

        const response = await request(server).post('/auth/login').send({
            email,
            password,
        });

        expect(response.status).toBe(400);
    });

    it('should return status 200, user and token when credetials are correct', async () => {
        const email = testUserData.email;
        const password = testUserData.password;

        const response = await request(server).post('/auth/login').send({
            email,
            password,
        });

        const decodedToken = jwt.verify(
            response.body.token,
            process.env.JWT_SECRET
        );

        expect(response.status).toBe(200);
        expect(response.body.user).toBeTruthy();
        expect(response.body.token).toBeTruthy();
        expect(response.body.user.id).toBe(testUser.id);
        expect(response.body.user.email).toBe(email);
        expect(response.body.user.password).toBeFalsy();

        expect(decodedToken.sub).toBe(testUser.id);
    });
});
