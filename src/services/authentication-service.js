class AuthenticationService {
    constructor(repository) {
        this._repository = repository;
    }

    async addRefreshToken(token) {
        await this._repository.addToken(token);
    }

    async verifyRefreshToken(token) {
        await this._repository.verifyToken(token);
    }

    async deleteRefreshToken(token) {
        await this._repository.deleteToken(token);
    }
}

export default AuthenticationService;
