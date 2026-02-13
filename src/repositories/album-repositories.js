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
            text: 'SELECT * FROM albums WHERE id = $1', values: [id]
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
}

export default AlbumRepositories;
