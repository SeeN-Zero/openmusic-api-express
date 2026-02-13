import {Pool} from 'pg';
import {nanoid} from 'nanoid';

import InvariantError from '../exceptions/invariant-error.js';
import AuthenticationError from '../exceptions/authentication-error.js';
import NotFoundError from '../exceptions/not-found-error.js';

class UserRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this.pool.query(query);

        if (result.rowCount > 0) {
            throw new InvariantError('Username sudah digunakan');
        }
    }

    async addUser({username, password, fullname}) {
        const id = `user-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
            values: [id, username, password, fullname],
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async getUserByUsername(username) {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this.pool.query(query);

        if (!result.rowCount) {
            throw new AuthenticationError('Kredensial yang diberikan salah');
        }

        return result.rows[0];
    }

    async verifyUserById(id) {
        const query = {
            text: 'SELECT id FROM users WHERE id = $1',
            values: [id],
        };

        const result = await this.pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('User tidak ditemukan');
        }
    }
}

export default UserRepositories;
