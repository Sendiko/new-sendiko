import * as Minio from 'minio';

const endpoint = (process.env.MINIO_ENDPOINT || 'localhost')
  .replace(/^https?:\/\//, '')
  .split(':')[0];

const port = parseInt(process.env.MINIO_PORT || '9002', 10);
const useSSL = process.env.MINIO_USE_SSL === 'true';
const accessKey = process.env.MINIO_ACCESS_KEY || 'admin';
const secretKey = process.env.MINIO_SECRET_KEY || 'ChangeMeToSomethingSecure123';

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'sendiko-portfolio';
export const PUBLIC_URL_BASE = process.env.MINIO_PUBLIC_URL || '/api/storage/file';

let minioClient: Minio.Client | null = null;

export function getMinioClient(): Minio.Client {
  if (!minioClient) {
    minioClient = new Minio.Client({
      endPoint: endpoint,
      port: port,
      useSSL: useSSL,
      accessKey: accessKey,
      secretKey: secretKey,
    });
  }
  return minioClient;
}

/**
 * Ensures the MinIO bucket exists. Creates it if it doesn't.
 */
export async function ensureBucketExists(): Promise<void> {
  const client = getMinioClient();
  try {
    const exists = await client.bucketExists(BUCKET_NAME);
    if (!exists) {
      await client.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`[STORAGE] Bucket "${BUCKET_NAME}" created successfully.`);
    }
  } catch (error) {
    console.error(`[STORAGE ERROR] Failed to verify/create bucket "${BUCKET_NAME}":`, error);
    throw error;
  }
}

/**
 * Sanitize filename to prevent directory traversal or invalid path characters
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-');
}

export interface UploadResult {
  key: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

/**
 * Upload a file Buffer or Uint8Array to MinIO.
 */
export async function uploadFile(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string,
  folder = 'uploads'
): Promise<UploadResult> {
  await ensureBucketExists();
  const client = getMinioClient();

  const cleanName = sanitizeFileName(originalFilename);
  const timestamp = Date.now();
  const objectKey = `${folder}/${timestamp}-${cleanName}`;

  const metaData = {
    'Content-Type': mimeType,
  };

  await client.putObject(BUCKET_NAME, objectKey, buffer, buffer.length, metaData);

  const cleanBase = PUBLIC_URL_BASE.endsWith('/')
    ? PUBLIC_URL_BASE.slice(0, -1)
    : PUBLIC_URL_BASE;

  const url = `${cleanBase}/${objectKey}`;

  return {
    key: objectKey,
    url,
    filename: originalFilename,
    mimeType,
    size: buffer.length,
  };
}

/**
 * Generate a presigned PUT URL for direct client-side upload to MinIO.
 * @param filename Name of the file to upload
 * @param folder Subfolder path (default 'uploads')
 * @param expirySeconds URL validity in seconds (default 24h = 86400s)
 */
export async function getPresignedUploadUrl(
  filename: string,
  folder = 'uploads',
  expirySeconds = 24 * 60 * 60
) {
  await ensureBucketExists();
  const client = getMinioClient();

  const cleanName = sanitizeFileName(filename);
  const objectKey = `${folder}/${Date.now()}-${cleanName}`;

  const uploadUrl = await client.presignedPutObject(BUCKET_NAME, objectKey, expirySeconds);
  const cleanBase = PUBLIC_URL_BASE.endsWith('/')
    ? PUBLIC_URL_BASE.slice(0, -1)
    : PUBLIC_URL_BASE;
  const publicUrl = `${cleanBase}/${objectKey}`;

  return {
    uploadUrl,
    key: objectKey,
    publicUrl,
    expiresIn: expirySeconds,
  };
}

/**
 * Generate a presigned GET URL for temporary private download directly from MinIO.
 * @param key Object key in bucket
 * @param expirySeconds URL validity in seconds (default 24h = 86400s)
 */
export async function getPresignedDownloadUrl(
  key: string,
  expirySeconds = 24 * 60 * 60
) {
  await ensureBucketExists();
  const client = getMinioClient();

  const downloadUrl = await client.presignedGetObject(BUCKET_NAME, key, expirySeconds);

  return {
    downloadUrl,
    key,
    expiresIn: expirySeconds,
  };
}

/**
 * Get an object file stream and stat details from MinIO.
 */
export async function getFileStream(key: string) {
  const client = getMinioClient();
  const stat = await client.statObject(BUCKET_NAME, key);
  const stream = await client.getObject(BUCKET_NAME, key);
  return { stream, stat };
}

/**
 * Delete an object from MinIO.
 */
export async function deleteFile(key: string): Promise<void> {
  const client = getMinioClient();
  await client.removeObject(BUCKET_NAME, key);
}

export interface StorageItem {
  key: string;
  url: string;
  size: number;
  lastModified: Date;
}

/**
 * List objects in the bucket with optional prefix filtering.
 */
export async function listFiles(prefix = ''): Promise<StorageItem[]> {
  await ensureBucketExists();
  const client = getMinioClient();

  return new Promise((resolve, reject) => {
    const items: StorageItem[] = [];
    const stream = client.listObjectsV2(BUCKET_NAME, prefix, true);

    stream.on('data', (obj) => {
      if (obj.name) {
        const cleanBase = PUBLIC_URL_BASE.endsWith('/')
          ? PUBLIC_URL_BASE.slice(0, -1)
          : PUBLIC_URL_BASE;

        items.push({
          key: obj.name,
          url: `${cleanBase}/${obj.name}`,
          size: obj.size || 0,
          lastModified: obj.lastModified || new Date(),
        });
      }
    });

    stream.on('error', (err) => {
      console.error('[STORAGE ERROR] Error listing files:', err);
      reject(err);
    });

    stream.on('end', () => {
      items.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
      resolve(items);
    });
  });
}
