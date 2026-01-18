import {Pool} from 'pg';
import {nanoid} from "nanoid";

class SongRepository {
    constructor() {
        this.pool = new Pool();
    }

    async createSong({title, year, genre, performer, duration, albumId}) {
        const id = 'song-' + nanoid(16);

        const query = {
            text: 'INSERT INTO songs (id, title, year, genre, performer, duration, album_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId]
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async getSongs(title = '', performer = '') {
        let text = 'SELECT id, title, performer FROM songs WHERE 1=1';
        const values = [];

        if (title) {
            values.push(`%${title}%`);
            text += ` AND title ILIKE $${values.length}`;
        }

        if (performer) {
            values.push(`%${performer}%`);
            text += ` AND performer ILIKE $${values.length}`;
        }

        const result = await this.pool.query({text, values});
        return result.rows;
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1', values: [id]
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async updateSongById(id, {title, year, genre, performer, duration, albumId}) {
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7',
            values: [title, year, genre, performer, duration, albumId, id]
        };

        const result = await this.pool.query(query);
        return result.rowCount;
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1', values: [id]
        };

        const result = await this.pool.query(query);
        return result.rowCount;
    }

    async getSongsByAlbumId(albumId) {
        const query = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1', values: [albumId],
        };

        const result = await this.pool.query(query);
        return result.rows;
    }
}

export default SongRepository;
