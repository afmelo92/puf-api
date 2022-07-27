import jwt from 'jsonwebtoken';

import authConfig from '~/config/auth';

export function generate(
    payload,
    options = {
        expiresIn: authConfig.jwt.expiresIn,
    }
) {
    return jwt.sign(payload, authConfig.jwt.secret, {
        ...options,
    });
}
