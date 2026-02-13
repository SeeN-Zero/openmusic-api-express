import {Pool} from 'pg';
import {nanoid} from 'nanoid';

import NotFoundError from '../exceptions/not-found-error.js';
import AuthorizationError from '../exceptions/authorization-error.js';
import InvariantError from '../exceptions/invariant-error.js';

class PlaylistRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async executeInTransaction(callback) {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async addPlaylist({name, owner}) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async getPlaylists(owner) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username
                FROM playlists
                JOIN users ON users.id = playlists.owner
                LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
                WHERE playlists.owner = $1 OR collaborations.user_id = $1
                GROUP BY playlists.id, playlists.name, users.username`,
            values: [owner],
        };

        const result = await this.pool.query(query);
        return result.rows;
    }

    async getPlaylistById(id) {
        const query = {
            text: 'SELECT playlists.id, playlists.name, playlists.owner, users.username FROM playlists JOIN users ON users.id = playlists.owner WHERE playlists.id = $1',
            values: [id],
        };

        const result = await this.pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows[0];
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT owner FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this.pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        if (result.rows[0].owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyPlaylistAccess(id, userId) {
        const playlistQuery = {
            text: 'SELECT owner FROM playlists WHERE id = $1',
            values: [id],
        };

        const playlistResult = await this.pool.query(playlistQuery);

        if (!playlistResult.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const {owner} = playlistResult.rows[0];
        if (owner === userId) {
            return;
        }

        const collaborationQuery = {
            text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [id, userId],
        };

        const collaborationResult = await this.pool.query(collaborationQuery);

        if (!collaborationResult.rowCount) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async addPlaylistSong(playlistId, songId, client = null) {
        const id = `playlist-song-${nanoid(16)}`;
        const executor = client || this.pool;

        const query = {
            text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        try {
            const result = await executor.query(query);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505' && error.constraint === 'playlist_songs_playlist_id_song_id_unique') {
                throw new InvariantError('Lagu sudah ada di playlist');
            }

            throw error;
        }
    }

    async addPlaylistSongActivity({playlistId, songId, userId, action, time}, client = null) {
        const id = `playlist-activity-${nanoid(16)}`;
        const executor = client || this.pool;

        const query = {
            text: 'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES ($1, $2, $3, $4, $5, $6)',
            values: [id, playlistId, songId, userId, action, time],
        };

        await executor.query(query);
    }

    async deletePlaylistSong(playlistId, songId, client = null) {
        const executor = client || this.pool;
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
            values: [playlistId, songId],
        };

        const result = await executor.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Lagu tidak ditemukan di playlist');
        }
    }

    async getPlaylistSongs(playlistId) {
        const query = {
            text: 'SELECT songs.id, songs.title, songs.performer FROM playlist_songs JOIN songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1',
            values: [playlistId],
        };

        const result = await this.pool.query(query);
        return result.rows;
    }

    async getPlaylistActivities(playlistId) {
        const query = {
            text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
                FROM playlist_song_activities
                JOIN users ON users.id = playlist_song_activities.user_id
                JOIN songs ON songs.id = playlist_song_activities.song_id
                WHERE playlist_song_activities.playlist_id = $1
                ORDER BY playlist_song_activities.time ASC`,
            values: [playlistId],
        };

        const result = await this.pool.query(query);
        return result.rows;
    }

    async deletePlaylist(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this.pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
    }
}

export default PlaylistRepositories;
