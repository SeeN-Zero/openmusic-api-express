import NotFoundError from '../exceptions/not-found-error.js';
import InvariantError from '../exceptions/invariant-error.js';

class SongService {
    constructor(repository) {
        this._repository = repository;
    }

    async addSong({title, year, genre, performer, duration, albumId}) {
        const result = await this._repository.createSong({
            title, year, genre, performer, duration, albumId
        });

        if (!result.id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.id;
    }

    async getSongs(title, performer) {
        return this._repository.getSongs(title, performer);
    }

    async getSongById(id) {
        const song = await this._repository.getSongById(id);

        if (!song) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        const {album_id, ...songData} = song;
        return {
            ...songData, albumId: album_id,
        };
    }

    async editSongById(id, {title, year, genre, performer, duration, albumId}) {
        const rowCount = await this._repository.updateSongById(id, {
            title, year, genre, performer, duration, albumId
        });

        if (!rowCount) {
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
        }
    }

    async deleteSongById(id) {
        const rowCount = await this._repository.deleteSongById(id);

        if (!rowCount) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }
    }
}

export default SongService;
