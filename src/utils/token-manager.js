import jwt from 'jsonwebtoken';
import AuthenticationError from '../exceptions/authentication-error.js';
import InvariantError from '../exceptions/invariant-error.js';

const ACCESS_TOKEN_AGE = process.env.ACCESS_TOKEN_AGE || '30m';
const REFRESH_TOKEN_AGE = process.env.REFRESH_TOKEN_AGE || '7d';

const TokenManager = {
    generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {expiresIn: ACCESS_TOKEN_AGE}),
    generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {expiresIn: REFRESH_TOKEN_AGE}),
    verifyAccessToken: (accessToken) => {
        try {
            return jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
        } catch {
            throw new AuthenticationError('Access token tidak valid');
        }
    },
    verifyRefreshToken: (refreshToken) => {
        try {
            return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        } catch {
            throw new InvariantError('Refresh token tidak valid');
        }
    },
};

export default TokenManager;
