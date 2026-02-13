class UserController {
    constructor(service) {
        this._service = service;
    }

    async postUserHandler(req, res, next) {
        try {
            const userId = await this._service.addUser(req.validated);

            res.status(201).json({
                status: 'success',
                data: {
                    userId,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
