import { Readable } from 'stream';
import { cloudinary } from '../config/cloudinary.js';

function uploadStream(buffer, options) {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    Readable.from(buffer).pipe(upload);
  });
}

/**
 * Upload a buffer to Cloudinary folder assetflow.
 */
export async function uploadFile(buffer, options = {}) {
  const { folder = 'assetflow', resource_type = 'auto', public_id } = options;
  return uploadStream(buffer, {
    folder,
    resource_type,
    ...(public_id && { public_id }),
  });
}

/**
 * Upload from remote URL (e.g. Replicate output).
 */
export async function uploadFromUrl(imageUrl, options = {}) {
  const { folder = 'assetflow/cards' } = options;
  return cloudinary.uploader.upload(imageUrl, {
    folder,
    resource_type: 'image',
  });
}

export async function deleteFile(publicId) {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId);
}
