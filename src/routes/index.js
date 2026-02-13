import express from 'express';
// Import Repositories
import AlbumRepositories from '../repositories/album-repositories.js';
import SongRepository from '../repositories/song-repositories.js';
import UserRepositories from '../repositories/user-repositories.js';
import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import PlaylistRepositories from '../repositories/playlist-repositories.js';
import CollaborationRepositories from '../repositories/collaboration-repositories.js';
// Import Services
import AlbumService from '../services/album-services.js';
import SongService from '../services/song-service.js';
import UserService from '../services/user-service.js';
import AuthenticationService from '../services/authentication-service.js';
import PlaylistService from '../services/playlist-service.js';
import CollaborationService from '../services/collaboration-service.js';
// Import Controllers
import AlbumController from '../controllers/album-controllers.js';
import SongController from '../controllers/song-controllers.js';
import UserController from '../controllers/user-controllers.js';
import AuthenticationController from '../controllers/authentication-controllers.js';
import PlaylistController from '../controllers/playlist-controllers.js';
import CollaborationController from '../controllers/collaboration-controllers.js';

// Import Middleware & Schemas
import validate from '../middlewares/validate.js';
import authenticate from '../middlewares/authentication.js';
import {
    albumPayloadSchema,
    songPayloadSchema,
    userPayloadSchema,
    authenticationPayloadSchema,
    refreshTokenPayloadSchema,
    playlistPayloadSchema,
    playlistSongPayloadSchema,
    collaborationPayloadSchema,
} from '../validator/schema.js';

const router = express.Router();

// 1. Inisialisasi Dependency
const albumRepository = new AlbumRepositories();
const songRepository = new SongRepository();
const userRepository = new UserRepositories();
const authenticationRepository = new AuthenticationRepositories();
const playlistRepository = new PlaylistRepositories();
const collaborationRepository = new CollaborationRepositories();

const albumService = new AlbumService(albumRepository, songRepository);
const songService = new SongService(songRepository);
const userService = new UserService(userRepository);
const authenticationService = new AuthenticationService(authenticationRepository);
const playlistService = new PlaylistService(playlistRepository, songRepository);
const collaborationService = new CollaborationService(collaborationRepository, playlistRepository, userRepository);

const albumController = new AlbumController(albumService);
const songController = new SongController(songService);
const userController = new UserController(userService);
const authenticationController = new AuthenticationController(userService, authenticationService);
const playlistController = new PlaylistController(playlistService);
const collaborationController = new CollaborationController(collaborationService);

// --- ROUTES ALBUMS ---
router.post('/albums', validate(albumPayloadSchema), albumController.postAlbumHandler.bind(albumController));
router.get('/albums/:id', albumController.getAlbumByIdHandler.bind(albumController));
router.put('/albums/:id', validate(albumPayloadSchema), albumController.putAlbumByIdHandler.bind(albumController));
router.delete('/albums/:id', albumController.deleteAlbumByIdHandler.bind(albumController));

// --- ROUTES SONGS ---
router.post('/songs', validate(songPayloadSchema), songController.postSongHandler.bind(songController));
router.get('/songs', songController.getSongsHandler.bind(songController));
router.get('/songs/:id', songController.getSongByIdHandler.bind(songController));
router.put('/songs/:id', validate(songPayloadSchema), songController.putSongByIdHandler.bind(songController));
router.delete('/songs/:id', songController.deleteSongByIdHandler.bind(songController));

// --- ROUTES PLAYLISTS ---
router.post('/playlists', authenticate, validate(playlistPayloadSchema), playlistController.postPlaylistHandler.bind(playlistController));
router.get('/playlists', authenticate, playlistController.getPlaylistsHandler.bind(playlistController));
router.delete('/playlists/:id', authenticate, playlistController.deletePlaylistHandler.bind(playlistController));
router.post('/playlists/:id/songs', authenticate, validate(playlistSongPayloadSchema), playlistController.postPlaylistSongHandler.bind(playlistController));
router.get('/playlists/:id/songs', authenticate, playlistController.getPlaylistSongsHandler.bind(playlistController));
router.delete('/playlists/:id/songs', authenticate, validate(playlistSongPayloadSchema), playlistController.deletePlaylistSongHandler.bind(playlistController));
router.get('/playlists/:id/activities', authenticate, playlistController.getPlaylistActivitiesHandler.bind(playlistController));

// --- ROUTES USERS ---
router.post('/users', validate(userPayloadSchema), userController.postUserHandler.bind(userController));

// --- ROUTES AUTHENTICATIONS ---
router.post('/authentications', validate(authenticationPayloadSchema), authenticationController.postAuthenticationHandler.bind(authenticationController));
router.put('/authentications', validate(refreshTokenPayloadSchema), authenticationController.putAuthenticationHandler.bind(authenticationController));
router.delete('/authentications', validate(refreshTokenPayloadSchema), authenticationController.deleteAuthenticationHandler.bind(authenticationController));

// --- ROUTES COLLABORATIONS ---
router.post('/collaborations', authenticate, validate(collaborationPayloadSchema), collaborationController.postCollaborationHandler.bind(collaborationController));
router.delete('/collaborations', authenticate, validate(collaborationPayloadSchema), collaborationController.deleteCollaborationHandler.bind(collaborationController));

export default router;
