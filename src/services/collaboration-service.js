import InvariantError from '../exceptions/invariant-error.js';

class CollaborationService {
    constructor(collaborationRepository, playlistRepository, userRepository) {
        this._collaborationRepository = collaborationRepository;
        this._playlistRepository = playlistRepository;
        this._userRepository = userRepository;
    }

    async addCollaboration(playlistId, userId, owner) {
        await this._playlistRepository.verifyPlaylistOwner(playlistId, owner);
        await this._userRepository.verifyUserById(userId);

        const result = await this._collaborationRepository.addCollaboration(playlistId, userId);
        if (!result.id) {
            throw new InvariantError('Kolaborasi gagal ditambahkan');
        }

        return result.id;
    }

    async deleteCollaboration(playlistId, userId, owner) {
        await this._playlistRepository.verifyPlaylistOwner(playlistId, owner);
        await this._userRepository.verifyUserById(userId);
        await this._collaborationRepository.deleteCollaboration(playlistId, userId);
    }
}

export default CollaborationService;
