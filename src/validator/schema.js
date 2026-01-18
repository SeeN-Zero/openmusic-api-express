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

// --- QUERY SCHEMAS (Opsional) ---
export const albumQuerySchema = Joi.object({
    id: Joi.string().empty(),
});
