import * as bcrypt from 'bcrypt';

import authConfig from '~/config/auth';

export async function hash(plaintext) {
    return bcrypt.hash(plaintext, authConfig.hash.salt);
}

export async function compare(plaintext, hash) {
    return bcrypt.compare(plaintext, hash);
}
