import {createClient} from 'redis';

class CacheService {
    constructor() {
        this._client = createClient({
            socket: {
                host: process.env.REDIS_SERVER,
            },
        });

        this._client.on('error', (error) => {
            console.error('Redis error:', error.message);
        });
        this._client.on('connect', () => {
            console.log('Redis client connected');
        });

        this._connectPromise = this._client.connect();
    }

    async _ensureConnection() {
        await this._connectPromise;
    }

    async set(key, value, expirationInSecond = 1800) {
        await this._ensureConnection();
        await this._client.set(key, value, {
            EX: expirationInSecond,
        });
    }

    async get(key) {
        await this._ensureConnection();
        const result = await this._client.get(key);
        if (result === null) {
            throw new Error('Cache not found');
        }

        return result;
    }

    async delete(key) {
        await this._ensureConnection();
        return this._client.del(key);
    }
}

export default CacheService;
