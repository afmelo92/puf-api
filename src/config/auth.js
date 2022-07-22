export default {
    hash: {
        salt: 8,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default',
        expiresIn: '1d',
    },
};
