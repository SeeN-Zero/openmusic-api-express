class PlaylistController {
    constructor(service, producerService) {
        this._service = service;
        this._producerService = producerService;
    }

    async postPlaylistHandler(req, res, next) {
        try {
            const {userId} = req.auth;
            const playlistId = await this._service.addPlaylist({
                name: req.validated.name,
                owner: userId,
            });

            res.status(201).json({
                status: 'success',
                data: {
                    playlistId,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async getPlaylistsHandler(req, res, next) {
        try {
            const {userId} = req.auth;
            const playlists = await this._service.getPlaylists(userId);

            res.json({
                status: 'success',
                data: {
                    playlists,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async deletePlaylistHandler(req, res, next) {
        try {
            const {userId} = req.auth;
            const {id} = req.params;

            await this._service.deletePlaylist(id, userId);

            res.json({
                status: 'success',
                message: 'Playlist berhasil dihapus',
            });
        } catch (error) {
            next(error);
        }
    }

    async postPlaylistSongHandler(req, res, next) {
        try {
            const {userId} = req.auth;
            const {id} = req.params;

            await this._service.addSongToPlaylist(id, req.validated.songId, userId);

            res.status(201).json({
                status: 'success',
                message: 'Lagu berhasil ditambahkan ke playlist',
            });
        } catch (error) {
            next(error);
        }
    }

    async getPlaylistSongsHandler(req, res, next) {
        try {
            const {userId} = req.auth;
            const {id} = req.params;

            const playlist = await this._service.getPlaylistSongs(id, userId);

            res.json({
                status: 'success',
                data: {
                    playlist,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async deletePlaylistSongHandler(req, res, next) {
        try {
            const {userId} = req.auth;
            const {id} = req.params;

            await this._service.deleteSongFromPlaylist(id, req.validated.songId, userId);

            res.json({
                status: 'success',
                message: 'Lagu berhasil dihapus dari playlist',
            });
        } catch (error) {
            next(error);
        }
    }

    async getPlaylistActivitiesHandler(req, res, next) {
        try {
            const {userId} = req.auth;
            const {id} = req.params;

            const activities = await this._service.getPlaylistActivities(id, userId);

            res.json({
                status: 'success',
                data: activities,
            });
        } catch (error) {
            next(error);
        }
    }

    async postExportPlaylistHandler(req, res, next) {
        try {
            const {playlistId} = req.params;
            const {userId} = req.auth;
            const {targetEmail} = req.validated;

            await this._service.verifyPlaylistOwner(playlistId, userId);

            await this._producerService.sendMessage(process.env.RABBITMQ_QUEUE, JSON.stringify({
                playlistId,
                targetEmail,
            }));

            res.status(201).json({
                status: 'success',
                message: 'Permintaan Anda sedang kami proses',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default PlaylistController;
