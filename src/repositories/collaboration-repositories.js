import {Pool} from 'pg';
import {nanoid} from 'nanoid';

import NotFoundError from '../exceptions/not-found-error.js';
import InvariantError from '../exceptions/invariant-error.js';

class CollaborationRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async addCollaboration(playlistId, userId) {
        const id = `collab-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO collaborations (id, playlist_id, user_id) VALUES ($1, $2, $3) RETURNING id',
            values: [id, playlistId, userId],
        };

        try {
            const result = await this.pool.query(query);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505' && error.constraint === 'collaborations_playlist_id_user_id_unique') {
                throw new InvariantError('Kolaborasi sudah terdaftar');
            }

            throw error;
        }
    }

    async deleteCollaboration(playlistId, userId) {
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userId],
        };

        const result = await this.pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Kolaborasi tidak ditemukan');
        }
    }
}

export default CollaborationRepositories;
