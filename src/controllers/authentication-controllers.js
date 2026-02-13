import TokenManager from '../utils/token-manager.js';

class AuthenticationController {
    constructor(userService, authenticationService) {
        this._userService = userService;
        this._authenticationService = authenticationService;
    }

    async postAuthenticationHandler(req, res, next) {
        try {
            const {username, password} = req.validated;
            const userId = await this._userService.verifyUserCredential(username, password);

            const accessToken = TokenManager.generateAccessToken({userId});
            const refreshToken = TokenManager.generateRefreshToken({userId});

            await this._authenticationService.addRefreshToken(refreshToken);

            res.status(201).json({
                status: 'success',
                data: {
                    accessToken,
                    refreshToken,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async putAuthenticationHandler(req, res, next) {
        try {
            const {refreshToken} = req.validated;

            const {userId} = TokenManager.verifyRefreshToken(refreshToken);
            await this._authenticationService.verifyRefreshToken(refreshToken);

            const accessToken = TokenManager.generateAccessToken({userId});

            res.json({
                status: 'success',
                data: {
                    accessToken,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAuthenticationHandler(req, res, next) {
        try {
            const {refreshToken} = req.validated;

            TokenManager.verifyRefreshToken(refreshToken);
            await this._authenticationService.verifyRefreshToken(refreshToken);
            await this._authenticationService.deleteRefreshToken(refreshToken);

            res.json({
                status: 'success',
                message: 'Refresh token berhasil dihapus',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthenticationController;
