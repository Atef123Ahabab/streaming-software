# 🌟 Enhanced Cloud Storage Application

A modern, secure, and user-friendly cloud storage solution built with React.js and Node.js.

## ✨ Features

### 🔐 **Secure Authentication**
- User registration and login system
- JWT-based authentication
- Protected routes and API endpoints

### 📁 **File Management**
- **Large File Support**: Upload files up to 100MB
- **All File Types**: Support for any file format
- **Drag & Drop**: Intuitive file upload interface
- **Progress Tracking**: Real-time upload progress with percentage
- **File Preview**: Visual file type indicators

### 💾 **Generous Storage**
- **10GB Storage**: Each user gets 10GB of cloud storage
- **Real-time Usage**: Live storage tracking and visualization
- **Smart Limits**: Automatic storage limit enforcement

### 🚀 **Performance**
- **Fast Uploads**: Optimized for large file transfers
- **Quick Downloads**: Secure signed URLs for fast downloads
- **Responsive UI**: Works seamlessly on all devices
- **Global Access**: Available worldwide with internet connection

## 🛠 **Technology Stack**

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client with interceptors
- **React Router** - Client-side routing

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database for user and file metadata
- **AWS S3** - Secure file storage
- **JWT** - Authentication tokens
- **Multer** - File upload handling

## 🚀 **Getting Started**

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud)
- AWS S3 bucket (or MinIO for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloud-storage-app
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/cloudstorage
   JWT_SECRET=your_super_secret_jwt_key_here
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-unique-bucket-name
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on: http://localhost:5001

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Application runs on: http://localhost:3000

## 📖 **Usage Guide**

### For Users

1. **Registration**
   - Visit http://localhost:3000
   - Click "Sign up" to create a new account
   - Fill in username, email, and password (min 6 characters)
   - Passwords must match in confirmation field

2. **File Upload**
   - Drag and drop files onto the upload area
   - Or click "Upload a file" to browse
   - Watch real-time progress during upload
   - Files up to 100MB are supported

3. **File Management**
   - View all your files in the dashboard
   - Download files with one click
   - Delete files you no longer need
   - Monitor your storage usage

4. **Storage Monitoring**
   - Real-time storage usage display
   - Visual progress bar showing usage percentage
   - Clear indication of remaining storage space

### For Developers

#### API Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

**File Operations:**
- `GET /api/files` - List user files
- `POST /api/files/upload` - Upload file
- `GET /api/files/download/:id` - Download file
- `DELETE /api/files/:id` - Delete file

#### File Structure
```
cloud-storage-app/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── services/        # S3 service
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   └── utils/       # API configuration
│   └── public/          # Static files
└── README.md
```

## 🔧 **Configuration**

### Storage Limits
- **User Storage**: 10GB per user (configurable in User model)
- **File Size**: 100MB per file (configurable in routes/files.js)
- **File Types**: All types supported

### Security Features
- JWT token authentication
- CORS protection
- Helmet security headers
- File access control
- Signed URLs for downloads

## 🌍 **Global Deployment**

This application is designed for global use:
- Users worldwide can create accounts
- Secure file storage and retrieval
- Cross-platform compatibility
- Responsive design for all devices

## 📝 **Recent Enhancements**

- ✅ Increased storage limit from 1GB to 10GB
- ✅ Increased file upload limit from 10MB to 100MB
- ✅ Added real-time upload progress tracking
- ✅ Improved error handling and user feedback
- ✅ Enhanced storage usage visualization
- ✅ Centralized API configuration
- ✅ Better performance optimization

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository

---

**Built with ❤️ for secure and efficient cloud storage**
