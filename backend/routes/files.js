const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const User = require('../models/User');
const storageService = require('../services/storageService');
const auth = require('../middleware/auth');
const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Add file type restrictions if needed
    cb(null, true);
  }
});

// Upload file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    console.log('Upload request received');
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received:', req.file.originalname, 'Size:', req.file.size);
    
    const user = await User.findById(req.userId);
    console.log('User found:', user ? user.username : 'No user');
    
    // Check storage limit
    if (user.storageUsed + req.file.size > user.storageLimit) {
      return res.status(400).json({ message: 'Storage limit exceeded' });
    }

    // Upload to cloud storage
    console.log('Attempting to upload to storage service...');
    const storageResult = await storageService.uploadFile(req.file, req.userId);
    console.log('Storage upload successful:', storageResult.key);

    // Save file metadata to database
    const fileRecord = new File({
      filename: storageResult.key.split('/')[1], // Remove userId prefix
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      owner: req.userId,
      s3Key: storageResult.key
    });

    await fileRecord.save();

    // Update user storage
    user.storageUsed += req.file.size;
    await user.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: fileRecord._id,
        filename: fileRecord.originalName,
        size: fileRecord.size,
        mimetype: fileRecord.mimetype,
        uploadDate: fileRecord.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Get user files
router.get('/', auth, async (req, res) => {
  try {
    const files = await File.find({ owner: req.userId })
      .select('-s3Key')
      .sort({ createdAt: -1 });

    res.json({ files });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch files', error: error.message });
  }
});

// Download file
router.get('/download/:fileId', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check permissions
    const hasAccess = file.owner.toString() === req.userId || 
                     file.sharedWith.some(share => share.user.toString() === req.userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate signed URL for secure download
    const signedUrl = await storageService.getSignedUrl(file.s3Key);
    
    res.json({ downloadUrl: signedUrl });
  } catch (error) {
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
});

// Delete file
router.delete('/:fileId', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete from local storage
    await storageService.deleteFile(file.s3Key);

    // Update user storage
    const user = await User.findById(req.userId);
    user.storageUsed -= file.size;
    await user.save();

    // Delete from database
    await File.findByIdAndDelete(req.params.fileId);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

// Share file
router.post('/:fileId/share', auth, async (req, res) => {
  try {
    const { email, permission = 'read' } = req.body;
    const file = await File.findById(req.params.fileId);

    if (!file || file.owner.toString() !== req.userId) {
      return res.status(404).json({ message: 'File not found or access denied' });
    }

    const userToShare = await User.findOne({ email });
    if (!userToShare) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already shared
    const alreadyShared = file.sharedWith.some(
      share => share.user.toString() === userToShare._id.toString()
    );

    if (alreadyShared) {
      return res.status(400).json({ message: 'File already shared with this user' });
    }

    file.sharedWith.push({
      user: userToShare._id,
      permission
    });

    await file.save();

    res.json({ message: 'File shared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Share failed', error: error.message });
  }
});

// Serve files directly (for local storage)
router.get('/serve/:userId/:filename', async (req, res) => {
  try {
    const fileKey = `${req.params.userId}/${req.params.filename}`;
    const filePath = await storageService.serveFile(fileKey);
    
    // Send file directly
    res.sendFile(filePath);
  } catch (error) {
    res.status(404).json({ message: 'File not found', error: error.message });
  }
});

module.exports = router;
