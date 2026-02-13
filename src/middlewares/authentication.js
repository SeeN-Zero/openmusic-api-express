import AuthenticationError from '../exceptions/authentication-error.js';
import TokenManager from '../utils/token-manager.js';

const authenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new AuthenticationError('Missing authentication'));
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return next(new AuthenticationError('Invalid authentication'));
    }

    try {
        req.auth = TokenManager.verifyAccessToken(token);
        return next();
    } catch (error) {
        return next(error);
    }
};

export default authenticate;
