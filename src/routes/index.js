import express from 'express';
// Import Repositories
import AlbumRepositories from '../repositories/album-repositories.js';
import SongRepository from '../repositories/song-repositories.js';
// Import Services
import AlbumService from '../services/album-services.js';
import SongService from '../services/song-service.js';
// Import Controllers
import AlbumController from '../controllers/album-controllers.js';
import SongController from '../controllers/song-controllers.js';

// Import Middleware & Schemas
import validate from '../middlewares/validate.js';
import {albumPayloadSchema, songPayloadSchema} from '../validator/schema.js';

const router = express.Router();

// 1. Inisialisasi Dependency
const albumRepository = new AlbumRepositories();
const songRepository = new SongRepository();

const albumService = new AlbumService(albumRepository, songRepository);
const songService = new SongService(songRepository);

const albumController = new AlbumController(albumService);
const songController = new SongController(songService);

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

export default router;
