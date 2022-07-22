import * as bcrypt from 'bcrypt';

export async function compare(plaintext, hash) {
    return bcrypt.compare(plaintext, hash);
}
