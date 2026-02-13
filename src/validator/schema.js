import Joi from 'joi';

// --- ALBUM SCHEMAS ---

// Digunakan untuk POST /albums dan PUT /albums/{id}
export const albumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(2026).required(),
});

// --- SONG SCHEMAS ---

// Digunakan untuk POST /songs dan PUT /songs/{id}
export const songPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(2026).required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number().optional(), // Opsional sesuai spesifikasi gambar
    albumId: Joi.string().optional(),  // Opsional sesuai spesifikasi gambar
});

// --- USER SCHEMAS ---

export const userPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
});

// --- AUTHENTICATION SCHEMAS ---

export const authenticationPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

export const refreshTokenPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

// --- PLAYLIST SCHEMAS ---

export const playlistPayloadSchema = Joi.object({
    name: Joi.string().required(),
});

export const playlistSongPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});

// --- COLLABORATION SCHEMAS ---

export const collaborationPayloadSchema = Joi.object({
    playlistId: Joi.string().required(),
    userId: Joi.string().required(),
});

// --- QUERY SCHEMAS (Opsional) ---
export const albumQuerySchema = Joi.object({
    id: Joi.string().empty(),
});
