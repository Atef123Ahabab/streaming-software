import React, { useState, useRef } from 'react';
import api from '../utils/api';

const FileUpload = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (files.length === 0) return;
    const file = files[0];

    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      onUpload(response.data.file);
      setSuccess(`"${file.name}" added to your library!`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) handleFiles(e.target.files);
  };

  const onButtonClick = () => fileInputRef.current?.click();

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          dragActive
            ? 'border-stream-cyan bg-stream-cyan/5 shadow-neon-cyan'
            : 'border-white/10 hover:border-white/20'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          disabled={uploading}
        />

        <div className="text-center">
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-stream-neon mb-4"></div>
              <p className="text-sm text-stream-text mb-3">Uploading... {uploadProgress}%</p>
              <div className="w-full max-w-md bg-stream-dark rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-stream-neon to-stream-cyan transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-stream-neon/20 to-stream-cyan/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-stream-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-stream-text mb-1">
                <button
                  type="button"
                  className="font-bold text-stream-cyan hover:text-stream-neon transition-colors"
                  onClick={onButtonClick}
                >
                  Choose a file
                </button>{' '}
                or drag it here
              </p>
              <p className="text-xs text-stream-muted">
                Movies, anime, artwork — up to 100MB
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;