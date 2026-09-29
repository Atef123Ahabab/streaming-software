const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudStorageService {
  async uploadFile(file, userId) {
    try {
      const fileKey = `${userId}/${uuidv4()}-${file.originalname}`;
      
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto', // Automatically detect file type
            public_id: fileKey,
            folder: 'cloud-storage-app',
            use_filename: true,
            unique_filename: false,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      return {
        key: fileKey,
        location: result.secure_url,
        etag: result.etag || `"${Date.now()}"`
      };
    } catch (error) {
      throw new Error(`Cloud storage upload failed: ${error.message}`);
    }
  }

  async downloadFile(key) {
    try {
      // For Cloudinary, we just return the URL
      const result = await cloudinary.api.resource(`cloud-storage-app/${key}`);
      return result.secure_url;
    } catch (error) {
      throw new Error(`File not found: ${error.message}`);
    }
  }

  async deleteFile(key) {
    try {
      await cloudinary.uploader.destroy(`cloud-storage-app/${key}`);
      return true;
    } catch (error) {
      throw new Error(`Cloud storage delete failed: ${error.message}`);
    }
  }

  async getSignedUrl(key, expires = 3600) {
    try {
      // Get the file info from Cloudinary
      const result = await cloudinary.api.resource(`cloud-storage-app/${key}`);
      return result.secure_url;
    } catch (error) {
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  async serveFile(key) {
    try {
      const result = await cloudinary.api.resource(`cloud-storage-app/${key}`);
      return result.secure_url;
    } catch (error) {
      throw new Error(`File not found: ${error.message}`);
    }
  }
}

module.exports = new CloudStorageService();
