import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import FileUpload from './FileUpload';
import FileList from './FileList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await api.get('/files');
      setFiles(response.data.files);
      setError('');
    } catch (error) {
      setError('Failed to fetch files');
      console.error('Fetch files error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (newFile) => {
    setFiles(prev => [newFile, ...prev]);
    // Refresh to get updated user storage info
    window.location.reload();
  };

  const handleFileDelete = (fileId) => {
    setFiles(prev => prev.filter(file => file._id !== fileId));
    // Refresh to get updated user storage info
    window.location.reload();
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const storagePercentage = (user?.storageUsed / user?.storageLimit) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Cloud Storage Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.username}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Storage Usage */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Storage Usage
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min(storagePercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>{formatBytes(user?.storageUsed || 0)} used</span>
              <span>{formatBytes((user?.storageLimit || 0) - (user?.storageUsed || 0))} remaining</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total: {formatBytes(user?.storageLimit || 0)} • {storagePercentage.toFixed(1)}% used
            </p>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Upload Files
            </h3>
            <FileUpload onUpload={handleFileUpload} />
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Your Files ({files.length})
              </h3>
              <button
                onClick={fetchFiles}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-600">Loading files...</p>
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-8">{error}</div>
            ) : (
              <FileList 
                files={files} 
                onDelete={handleFileDelete}
                onRefresh={fetchFiles}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
