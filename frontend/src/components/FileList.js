import React, { useState } from 'react';
import api from '../utils/api';

const FileList = ({ files, onDelete }) => {
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
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const handleDownload = async (fileId, filename) => {
    setDownloadingId(fileId);
    try {
      const response = await api.get(`/files/download/${fileId}`);
      const downloadUrl = response.data.downloadUrl;
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
    if (!window.confirm('Remove this from your library?')) return;
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

  const getIcon = (mimetype) => {
    if (mimetype?.startsWith('video/')) return '🎬';
    if (mimetype?.startsWith('image/')) return '🖼️';
    if (mimetype?.startsWith('audio/')) return '🎵';
    if (mimetype?.includes('pdf')) return '📄';
    if (mimetype?.includes('zip') || mimetype?.includes('rar')) return '🗜️';
    return '📁';
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-stream-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-stream-text mb-1">Nothing here yet</h3>
        <p className="text-sm text-stream-muted">Upload your first movie or anime above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <div
          key={file._id}
          className="group bg-stream-dark border border-white/5 rounded-xl overflow-hidden hover:border-stream-cyan/50 hover:shadow-neon-cyan transition-all"
        >
          <div className="aspect-video bg-gradient-to-br from-stream-purple/30 via-stream-neon/20 to-stream-cyan/20 flex items-center justify-center relative">
            <span className="text-5xl">{getIcon(file.mimetype)}</span>
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur text-xs text-stream-cyan font-bold rounded">
              {file.mimetype?.split('/')[0]?.toUpperCase() || 'FILE'}
            </div>
          </div>

          <div className="p-4">
            <h4 className="text-sm font-bold text-stream-text truncate mb-1" title={file.originalName}>
              {file.originalName}
            </h4>
            <p className="text-xs text-stream-muted mb-3">
              {formatBytes(file.size)} • {formatDate(file.createdAt)}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(file._id, file.originalName)}
                disabled={downloadingId === file._id}
                className="flex-1 py-2 text-xs font-bold text-stream-cyan border border-stream-cyan/30 rounded-lg hover:bg-stream-cyan/10 transition-all disabled:opacity-50"
              >
                {downloadingId === file._id ? '...' : '▶ Watch'}
              </button>
              <button
                onClick={() => handleDelete(file._id)}
                disabled={deletingId === file._id}
                className="px-3 py-2 text-xs font-bold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-50"
              >
                {deletingId === file._id ? '...' : '✕'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;