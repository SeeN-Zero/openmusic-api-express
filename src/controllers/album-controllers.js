import InvariantError from '../exceptions/invariant-error.js';

class AlbumController {
    constructor(service) {
        this._service = service;
    }

    async postAlbumHandler(req, res, next) {
        try {
            const albumId = await this._service.addAlbum(req.validated);

            res.status(201).json({
                status: 'success',
                data: {
                    albumId,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async getAlbumByIdHandler(req, res, next) {
        try {
            const { id } = req.params;
            const album = await this._service.getAlbumById(id);

            res.json({
                status: 'success',
                data: {
                    album,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async putAlbumByIdHandler(req, res, next) {
        try {
            const { id } = req.params;
            await this._service.editAlbumById(id, req.validated);

            res.json({
                status: 'success',
                message: 'Album berhasil diperbarui',
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAlbumByIdHandler(req, res, next) {
        try {
            const { id } = req.params;
            await this._service.deleteAlbumById(id);

            res.json({
                status: 'success',
                message: 'Album berhasil dihapus',
            });
        } catch (error) {
            next(error);
        }
    }

    async postUploadCoverHandler(req, res, next) {
        try {
            const {id} = req.params;
            const filename = req.file?.filename;

            if (!filename) {
                return next(new InvariantError('Berkas sampul tidak ditemukan'));
            }

            await this._service.uploadAlbumCover(id, filename);

            res.status(201).json({
                status: 'success',
                message: 'Sampul berhasil diunggah',
            });
        } catch (error) {
            next(error);
        }
    }

    async postAlbumLikeHandler(req, res, next) {
        try {
            const {id} = req.params;
            const {userId} = req.auth;

            await this._service.addAlbumLike(id, userId);

            res.status(201).json({
                status: 'success',
                message: 'Album berhasil disukai',
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAlbumLikeHandler(req, res, next) {
        try {
            const {id} = req.params;
            const {userId} = req.auth;

            await this._service.deleteAlbumLike(id, userId);

            res.json({
                status: 'success',
                message: 'Batal menyukai album',
            });
        } catch (error) {
            next(error);
        }
    }

    async getAlbumLikesHandler(req, res, next) {
        try {
            const {id} = req.params;
            const {likes, source} = await this._service.getAlbumLikesCount(id);

            if (source === 'cache') {
                res.set('X-Data-Source', 'cache');
            }

            res.json({
                status: 'success',
                data: {
                    likes,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AlbumController;
