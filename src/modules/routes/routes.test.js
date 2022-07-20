import request from 'supertest';

import { app } from '~/server';

let server = app.listen();

afterAll(async () => {
    await server.close();
});

describe('Auth routes', () => {
    // LOGIN

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
        const email = 'andre@email.com';
        const password = 'wrong-password';

        const response = await request(server).post('/auth/login').send({
            email,
            password,
        });

        expect(response.status).toBe(400);
    });
});
