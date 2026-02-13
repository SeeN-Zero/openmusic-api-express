class CollaborationController {
    constructor(service) {
        this._service = service;
    }

    async postCollaborationHandler(req, res, next) {
        try {
            const {userId: owner} = req.auth;
            const {playlistId, userId} = req.validated;

            const collaborationId = await this._service.addCollaboration(playlistId, userId, owner);

            res.status(201).json({
                status: 'success',
                data: {
                    collaborationId,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteCollaborationHandler(req, res, next) {
        try {
            const {userId: owner} = req.auth;
            const {playlistId, userId} = req.validated;

            await this._service.deleteCollaboration(playlistId, userId, owner);

            res.json({
                status: 'success',
                message: 'Kolaborasi berhasil dihapus',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default CollaborationController;
