// Smart storage service that switches between local and cloud storage
// based on environment

const isProduction = process.env.NODE_ENV === 'production';
const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME && 
                           process.env.CLOUDINARY_API_KEY && 
                           process.env.CLOUDINARY_API_SECRET;

let storageService;

if (isProduction && hasCloudinaryConfig) {
  // Use cloud storage in production
  storageService = require('./cloudStorageService');
  console.log('Using Cloudinary cloud storage');
} else {
  // Use local storage in development
  storageService = require('./localStorageService');
  console.log('Using local file storage');
}

module.exports = storageService;
