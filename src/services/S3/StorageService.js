const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const {
  getSignedUrl,
} = require('@aws-sdk/s3-request-presigner');
const { nanoid } = require('nanoid');

class StorageService {
  constructor() {
    this._S3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async writeFile(file, meta) {
    const filename = `image-${nanoid(16)}`;

    const parameter = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      Body: file._data,
      ContentType: meta.headers['content-type'],
    });

    await this._S3.send(parameter)

    return filename;
  }

  async readFile(filename) {
    return this.createPreSignedUrl({
      bucket: process.env.AWS_BUCKET_NAME,
      key: filename,
    });
  }

  createPreSignedUrl({ bucket, key }) {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key});
    return getSignedUrl(this._S3, command);
  }
}


module.exports = StorageService;