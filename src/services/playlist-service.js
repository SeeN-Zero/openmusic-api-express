import InvariantError from '../exceptions/invariant-error.js';
import NotFoundError from '../exceptions/not-found-error.js';

class PlaylistService {
    constructor(playlistRepository, songRepository) {
        this._playlistRepository = playlistRepository;
        this._songRepository = songRepository;
    }

    async addPlaylist({name, owner}) {
        const result = await this._playlistRepository.addPlaylist({name, owner});

        if (!result.id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.id;
    }

    async getPlaylists(owner) {
        return this._playlistRepository.getPlaylists(owner);
    }

    async deletePlaylist(id, owner) {
        await this._playlistRepository.verifyPlaylistOwner(id, owner);
        await this._playlistRepository.deletePlaylist(id);
    }

    async addSongToPlaylist(playlistId, songId, userId) {
        await this._playlistRepository.verifyPlaylistAccess(playlistId, userId);

        const song = await this._songRepository.getSongById(songId);
        if (!song) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        await this._playlistRepository.executeInTransaction(async (client) => {
            const result = await this._playlistRepository.addPlaylistSong(playlistId, songId, client);
            if (!result.id) {
                throw new InvariantError('Lagu gagal ditambahkan ke playlist');
            }

            await this._playlistRepository.addPlaylistSongActivity({
                playlistId,
                songId,
                userId,
                action: 'add',
                time: new Date().toISOString(),
            }, client);
        });
    }

    async getPlaylistSongs(playlistId, userId) {
        await this._playlistRepository.verifyPlaylistAccess(playlistId, userId);

        const playlist = await this._playlistRepository.getPlaylistById(playlistId);
        const songs = await this._playlistRepository.getPlaylistSongs(playlistId);

        return {
            id: playlist.id,
            name: playlist.name,
            username: playlist.username,
            songs,
        };
    }

    async deleteSongFromPlaylist(playlistId, songId, userId) {
        await this._playlistRepository.verifyPlaylistAccess(playlistId, userId);

        const song = await this._songRepository.getSongById(songId);
        if (!song) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        await this._playlistRepository.executeInTransaction(async (client) => {
            await this._playlistRepository.deletePlaylistSong(playlistId, songId, client);

            await this._playlistRepository.addPlaylistSongActivity({
                playlistId,
                songId,
                userId,
                action: 'delete',
                time: new Date().toISOString(),
            }, client);
        });
    }

    async getPlaylistActivities(playlistId, userId) {
        await this._playlistRepository.verifyPlaylistAccess(playlistId, userId);

        const activities = await this._playlistRepository.getPlaylistActivities(playlistId);
        const formatted = activities.map((activity) => ({
            ...activity,
            time: new Date(activity.time).toISOString(),
        }));

        return {
            playlistId,
            activities: formatted,
        };
    }
}

export default PlaylistService;
