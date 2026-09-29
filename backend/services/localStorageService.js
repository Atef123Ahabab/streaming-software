const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create uploads directory if it doesn't exist
const UPLOADS_DIR = path.join(__dirname, '../uploads');

class LocalStorageService {
  async init() {
    try {
      await fs.access(UPLOADS_DIR);
    } catch (error) {
      // Directory doesn't exist, create it
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
      console.log('Created uploads directory:', UPLOADS_DIR);
    }
  }

  async uploadFile(file, userId) {
    await this.init();
    
    const fileKey = `${userId}/${uuidv4()}-${file.originalname}`;
    const filePath = path.join(UPLOADS_DIR, fileKey);
    
    // Create user directory if it doesn't exist
    const userDir = path.dirname(filePath);
    await fs.mkdir(userDir, { recursive: true });
    
    try {
      // Write file to local storage
      await fs.writeFile(filePath, file.buffer);
      
      return {
        key: fileKey,
        location: filePath,
        etag: `"${Date.now()}"`
      };
    } catch (error) {
      throw new Error(`Local storage upload failed: ${error.message}`);
    }
  }

  async downloadFile(key) {
    const filePath = path.join(UPLOADS_DIR, key);
    
    try {
      await fs.access(filePath);
      return filePath;
    } catch (error) {
      throw new Error(`File not found: ${error.message}`);
    }
  }

  async deleteFile(key) {
    const filePath = path.join(UPLOADS_DIR, key);
    
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      throw new Error(`Local storage delete failed: ${error.message}`);
    }
  }

  async getSignedUrl(key, expires = 3600) {
    // For local storage, we'll return a direct download URL
    // Parse the key to get userId and filename
    const [userId, filename] = key.split('/');
    return `http://localhost:5001/api/files/serve/${userId}/${filename}`;
  }

  async serveFile(key) {
    const filePath = path.join(UPLOADS_DIR, key);
    
    try {
      await fs.access(filePath);
      return filePath;
    } catch (error) {
      throw new Error(`File not found: ${error.message}`);
    }
  }
}

module.exports = new LocalStorageService();
