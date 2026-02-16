import {Pool} from 'pg';
import {nanoid} from "nanoid";

class AlbumRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async createAlbum({name, year}) {
        const id = 'album-' + nanoid(16);

        const query = {
            text: 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, year]
        };

        const result = await this.pool.query(query);

        return result.rows[0];
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT id, name, year, cover_url FROM albums WHERE id = $1', values: [id]
        };

        const result = await this.pool.query(query);

        return result.rows[0];
    }

    async updateAlbum({id, name, year}) {
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3', values: [name, year, id]
        };

        const result = await this.pool.query(query);

        return result.rowCount;
    }

    async deleteAlbum(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1', values: [id]
        }

        const result = await this.pool.query(query);

        return result.rowCount;
    }

    async updateAlbumCover(id, coverUrl) {
        const query = {
            text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
            values: [coverUrl, id],
        };

        const result = await this.pool.query(query);
        return result.rowCount;
    }

    async verifyAlbumExists(id) {
        const query = {
            text: 'SELECT id FROM albums WHERE id = $1',
            values: [id],
        };

        const result = await this.pool.query(query);
        return result.rowCount > 0;
    }

    async addAlbumLike(userId, albumId) {
        const id = `user_album_like-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async deleteAlbumLike(userId, albumId) {
        const query = {
            text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        };

        const result = await this.pool.query(query);
        return result.rowCount;
    }

    async getAlbumLikesCount(albumId) {
        const query = {
            text: 'SELECT COUNT(*)::int AS likes FROM user_album_likes WHERE album_id = $1',
            values: [albumId],
        };

        const result = await this.pool.query(query);
        return result.rows[0].likes;
    }
}

export default AlbumRepositories;
