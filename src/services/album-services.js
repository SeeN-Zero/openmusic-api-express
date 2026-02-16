import NotFoundError from '../exceptions/not-found-error.js';
import InvariantError from '../exceptions/invariant-error.js';
import fs from 'fs/promises';
import path from 'path';

class AlbumService {
    constructor(albumRepository, songRepository, cacheService) {
        this._repository = albumRepository;
        this._songRepository = songRepository;
        this._cacheService = cacheService;
    }

    async addAlbum({name, year}) {
        const result = await this._repository.createAlbum({name, year});

        if (!result.id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.id;
    }

    async getAlbumById(id) {
        const album = await this._repository.getAlbumById(id);

        if (!album) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const songs = await this._songRepository.getSongsByAlbumId(id);

        const host = process.env.HOST || 'localhost';
        const port = process.env.PORT || 3000;
        const coverUrl = album.cover_url ? `http://${host}:${port}/covers/${album.cover_url}` : null;

        return {
            id: album.id,
            name: album.name,
            year: album.year,
            coverUrl,
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

    async uploadAlbumCover(id, filename) {
        const album = await this._repository.getAlbumById(id);

        if (!album) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const rowCount = await this._repository.updateAlbumCover(id, filename);
        if (!rowCount) {
            throw new InvariantError('Sampul gagal diunggah');
        }

        if (album.cover_url && album.cover_url !== filename) {
            const oldCoverPath = path.join(process.cwd(), 'cover', album.cover_url);
            try {
                await fs.unlink(oldCoverPath);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    throw error;
                }
            }
        }
    }

    async addAlbumLike(id, userId) {
        const albumExists = await this._repository.verifyAlbumExists(id);
        if (!albumExists) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        try {
            await this._repository.addAlbumLike(userId, id);
        } catch (error) {
            if (error.code === '23505') {
                throw new InvariantError('Album sudah disukai');
            }

            throw error;
        }

        await this._cacheService.delete(`album-likes:${id}`);
    }

    async deleteAlbumLike(id, userId) {
        const albumExists = await this._repository.verifyAlbumExists(id);
        if (!albumExists) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        await this._repository.deleteAlbumLike(userId, id);
        await this._cacheService.delete(`album-likes:${id}`);
    }

    async getAlbumLikesCount(id) {
        const albumExists = await this._repository.verifyAlbumExists(id);
        if (!albumExists) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const cacheKey = `album-likes:${id}`;

        try {
            const likes = await this._cacheService.get(cacheKey);
            return {
                likes: Number(likes),
                source: 'cache',
            };
        } catch {
            const likes = await this._repository.getAlbumLikesCount(id);
            await this._cacheService.set(cacheKey, likes);

            return {
                likes,
                source: 'database',
            };
        }
    }
}

export default AlbumService;
