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

describe('Auth routes', () => {
    // LOGIN

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

    it('should return status 400 when no email or no password are sent', async () => {
        const email = '';
        const password = '';

        const response = await request(server).post('/auth/login').send({
            email,
            password,
        });

        expect(response.status).toEqual(400);
    });

    it('should return status 400 when wrong email is sent', async () => {
        const email = 'wrong@email';
        const password = 'wrong-password';

        const response = await request(server).post('/auth/login').send({
            email,
            password,
        });

        expect(response.status).toEqual(400);
    });

    it('should return status 400 when wrong password is sent', async () => {
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

describe('Users routes', () => {
    let createdTestUser;
    let testEmailUser;
    let testDeletedUser;

    const testEmailUserData = {
        name: 'Jane Fonda',
        email: 'jane-fonda@email.com',
        password: '123456',
    };

    const testDeletedUserData = {
        name: 'Ray Liota',
        email: 'ray-liota@email.com',
        password: '123456',
    };

    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash(testEmailUserData.password, 8);

        const promiseEmailUser = prisma.user.create({
            data: {
                ...testEmailUserData,
                password: hashedPassword,
            },
        });

        const promiseDeletedUser = prisma.user.create({
            data: {
                ...testDeletedUserData,
                password: hashedPassword,
                deletedAt: new Date(),
            },
        });

        const users = await Promise.all([promiseEmailUser, promiseDeletedUser]);

        testEmailUser = users[0];
        testDeletedUser = users[1];
    });

    afterAll(async () => {
        await server.close();

        await prisma.user.deleteMany({
            where: {
                id: {
                    in: [
                        createdTestUser.id,
                        testEmailUser.id,
                        testDeletedUser.id,
                    ],
                },
            },
        });
    });

    // CREATE
    it('create :: should return status 400 if no email or password are sent', async () => {
        const email = '';
        const password = '';
        const name = testUserData.name;

        const response = await request(server).post('/users').send({
            name,
            email,
            password,
        });

        expect(response.status).toEqual(400);
    });

    it('create :: should return status 201, and user data when data is correct', async () => {
        const name = testUserData.name;
        const email = testUserData.email;
        const password = testUserData.password;

        const response = await request(server).post('/users').send({
            name,
            email,
            password,
        });

        createdTestUser = response.body.user;

        expect(response.status).toBe(201);
        expect(response.body.user).toBeTruthy();
        expect(response.body.user.id).toBeTruthy();
        expect(response.body.user.email).toBe(email);
        expect(response.body.user).not.toHaveProperty('password');
    });

    // LIST
    it('list :: should return status 200 with list of users data', async () => {
        const response = await request(server).get('/users');

        expect(response.status).toBe(200);
        expect(response.body.users.length).toBeGreaterThanOrEqual(0);
        response.body.users.forEach((user) => {
            expect(user).not.toHaveProperty('password');
        });
    });

    // SHOW
    it('show :: should return status 200 with user data', async () => {
        const response = await request(server).get(
            `/users/${createdTestUser.id}`
        );

        expect(response.status).toBe(200);
        expect(response.body.user).toBeTruthy();
        expect(response.body.user.id).toBe(createdTestUser.id);
        expect(response.body.user.name).toBe(createdTestUser.name);
        expect(response.body.user.email).toBe(createdTestUser.email);
        expect(response.body.user).not.toHaveProperty('password');
    });

    // UPDATE
    it('update :: should return status 405 if no id is sent', async () => {
        const response = await request(server).put(`/users`).send({
            name: 'Updated John Doe',
            email: 'updated-john@email.com',
            password: 'updated-password',
        });

        expect(response.status).toBe(405);
    });

    it('update :: should return status 400 if email is already used', async () => {
        const response = await request(server)
            .put(`/users/${createdTestUser.id}`)
            .send({
                email: testEmailUserData.email,
            });

        expect(response.status).toBe(400);
    });

    it('update :: should return status 200 with user data', async () => {
        const response = await request(server)
            .put(`/users/${createdTestUser.id}`)
            .send({
                name: 'Updated John Doe',
                email: 'updated-john@email.com',
                password: 'updated-password',
            });

        expect(response.status).toBe(200);
        expect(response.body.user).toBeTruthy();
        expect(response.body.user.id).toBe(createdTestUser.id);
        expect(response.body.user.name).toBe('Updated John Doe');
        expect(response.body.user.email).toBe('updated-john@email.com');
        expect(response.body.user).not.toHaveProperty('password');
    });

    // REMOVE
    it('remove :: should return status 405 if no id is sent', async () => {
        const response = await request(server).delete(`/users`);

        expect(response.status).toBe(405);
    });

    it('remove :: should return status 400 when user is already deleted', async () => {
        const response = await request(server).delete(
            `/users/${testDeletedUser.id}`
        );

        expect(response.status).toBe(400);
    });

    it('remove :: should return status 200 when user is successfully deleted', async () => {
        const response = await request(server).delete(
            `/users/${createdTestUser.id}`
        );

        expect(response.status).toBe(200);
        expect(response.body.user.deletedAt).toBeTruthy();
    });
});
