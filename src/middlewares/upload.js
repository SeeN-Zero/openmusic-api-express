import multer from 'multer';
import path from 'path';
import {nanoid} from 'nanoid';
import InvariantError from '../exceptions/invariant-error.js';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(process.cwd(), 'cover'));
    },
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, `cover-${Date.now()}-${nanoid(8)}${extension}`);
    },
});

const fileFilter = (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.tif', '.tiff'];
    const isImageMime = file.mimetype?.startsWith('image/');
    const isImageExtension = allowedExtensions.includes(extension);

    if (!isImageMime && !isImageExtension) {
        cb(new InvariantError('Berkas yang diunggah harus berupa gambar'));
        return;
    }

    cb(null, true);
};

const uploadCover = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 512 * 1024,
    },
});

export default uploadCover;
