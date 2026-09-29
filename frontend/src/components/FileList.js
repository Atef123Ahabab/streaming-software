import React, { useState } from 'react';
import api from '../utils/api';

const FileList = ({ files, onDelete, onRefresh }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async (fileId, filename) => {
    setDownloadingId(fileId);
    try {
      const response = await api.get(`/files/download/${fileId}`);
      const downloadUrl = response.data.downloadUrl;
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Download failed: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    setDeletingId(fileId);
    try {
      await api.delete(`/files/${fileId}`);
      onDelete(fileId);
    } catch (error) {
      alert('Delete failed: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) {
      return '🖼️';
    } else if (mimetype.startsWith('video/')) {
      return '🎥';
    } else if (mimetype.startsWith('audio/')) {
      return '🎵';
    } else if (mimetype.includes('pdf')) {
      return '📄';
    } else if (mimetype.includes('document') || mimetype.includes('word')) {
      return '📝';
    } else if (mimetype.includes('spreadsheet') || mimetype.includes('excel')) {
      return '📊';
    } else if (mimetype.includes('presentation') || mimetype.includes('powerpoint')) {
      return '📽️';
    } else if (mimetype.includes('zip') || mimetype.includes('rar')) {
      return '🗜️';
    } else {
      return '📁';
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading a file.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="grid gap-4">
        {files.map((file) => (
          <div
            key={file._id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl">
                {getFileIcon(file.mimetype)}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {file.originalName}
                </h4>
                <p className="text-sm text-gray-500">
                  {formatBytes(file.size)} • {formatDate(file.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownload(file._id, file.originalName)}
                disabled={downloadingId === file._id}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {downloadingId === file._id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleDelete(file._id)}
                disabled={deletingId === file._id}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {deletingId === file._id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
