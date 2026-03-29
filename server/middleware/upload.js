import multer from 'multer';

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'audio/mpeg',
  'audio/wav',
  'audio/webm',
  'application/pdf',
]);

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (ALLOWED_MIMES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Unsupported file type'));
  }
}

export const uploadSingle = multer({
  storage,
  limits: { fileSize: MAX_BYTES },
  fileFilter,
}).single('file');

export function uploadErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large (max 15MB)' });
    }
    return res.status(400).json({ message: err.message });
  }
  return next(err);
}
