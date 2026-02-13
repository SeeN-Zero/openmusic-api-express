import bcrypt from 'bcryptjs';
import InvariantError from '../exceptions/invariant-error.js';
import AuthenticationError from '../exceptions/authentication-error.js';

class UserService {
    constructor(repository) {
        this._repository = repository;
    }

    async addUser({username, password, fullname}) {
        await this._repository.verifyNewUsername(username);

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await this._repository.addUser({
            username,
            password: hashedPassword,
            fullname,
        });

        if (!result.id) {
            throw new InvariantError('User gagal ditambahkan');
        }

        return result.id;
    }

    async verifyUserCredential(username, password) {
        const {id, password: hashedPassword} = await this._repository.getUserByUsername(username);

        const match = await bcrypt.compare(password, hashedPassword);
        if (!match) {
            throw new AuthenticationError('Kredensial yang diberikan salah');
        }

        return id;
    }
}

export default UserService;
