const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

class S3Service {
  async uploadFile(file, userId) {
    const fileKey = `${userId}/${uuidv4()}-${file.originalname}`;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private'
    };

    try {
      const result = await s3.upload(params).promise();
      return {
        key: fileKey,
        location: result.Location,
        etag: result.ETag
      };
    } catch (error) {
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  async downloadFile(key) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    };

    try {
      return s3.getObject(params).createReadStream();
    } catch (error) {
      throw new Error(`S3 download failed: ${error.message}`);
    }
  }

  async deleteFile(key) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    };

    try {
      await s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      throw new Error(`S3 delete failed: ${error.message}`);
    }
  }

  async getSignedUrl(key, expires = 3600) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: expires
    };

    try {
      return s3.getSignedUrl('getObject', params);
    } catch (error) {
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }
}

module.exports = new S3Service();
