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
}

export default AlbumController;
