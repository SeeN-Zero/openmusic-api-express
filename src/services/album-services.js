import NotFoundError from '../exceptions/not-found-error.js';
import InvariantError from '../exceptions/invariant-error.js';

class AlbumService {
    constructor(albumRepository, songRepository) {
        this._repository = albumRepository;
        this._songRepository = songRepository;
    }

    async addAlbum({name, year}) {
        const result = await this._repository.createAlbum({name, year});

        if (!result.id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.id;
    }

    async getAlbumById(id) {
        // 1. Ambil data album dari repository
        const album = await this._repository.getAlbumById(id);

        if (!album) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const songs = await this._songRepository.getSongsByAlbumId(id);

        return {
            ...album,
            songs,
        };
    }

    async editAlbumById(id, {name, year}) {
        const rowCount = await this._repository.updateAlbum({id, name, year});

        if (!rowCount) {
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
        }
    }

    async deleteAlbumById(id) {
        const rowCount = await this._repository.deleteAlbum(id);

        if (!rowCount) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }
}

export default AlbumService;
