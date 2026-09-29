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
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchFiles(); }, []);

  const fetchFiles = async () => {
    try {
      const response = await api.get('/files');
      setFiles(response.data.files);
      setError('');
    } catch (error) {
      setError('Failed to load content');
      console.error('Fetch files error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (newFile) => {
    setFiles(prev => [newFile, ...prev]);
    window.location.reload();
  };

  const handleFileDelete = (fileId) => {
    setFiles(prev => prev.filter(file => file._id !== fileId));
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

  const videos = files.filter(f => f.mimetype?.startsWith('video/'));
  const images = files.filter(f => f.mimetype?.startsWith('image/'));

  const filteredFiles = filter === 'all' ? files
    : filter === 'videos' ? videos
    : filter === 'images' ? images
    : files;

  return (
    <div className="min-h-screen stream-gradient">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-stream-black/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-black tracking-tight">
                <span className="text-stream-neon neon-text">STREAM</span>
                <span className="text-stream-cyan neon-text-cyan">HUB</span>
              </h1>
              <div className="hidden md:flex gap-6 text-sm font-medium">
                <button
                  onClick={() => setFilter('all')}
                  className={`transition-colors ${filter === 'all' ? 'text-stream-cyan' : 'text-stream-muted hover:text-stream-text'}`}
                >
                  Home
                </button>
                <button
                  onClick={() => setFilter('videos')}
                  className={`transition-colors ${filter === 'videos' ? 'text-stream-cyan' : 'text-stream-muted hover:text-stream-text'}`}
                >
                  Movies & Anime
                </button>
                <button
                  onClick={() => setFilter('images')}
                  className={`transition-colors ${filter === 'images' ? 'text-stream-cyan' : 'text-stream-muted hover:text-stream-text'}`}
                >
                  Artwork
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-stream-muted">
                {user?.username}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-stream-text bg-white/5 hover:bg-stream-neon/20 border border-white/10 hover:border-stream-neon/50 rounded-lg transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-stream-neon/20 via-stream-purple/10 to-stream-cyan/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <p className="text-stream-cyan text-sm font-bold tracking-widest mb-2">
              FEATURED
            </p>
            <h2 className="text-5xl sm:text-6xl font-black text-stream-text leading-tight mb-4">
              Your universe of
              <br />
              <span className="text-stream-neon neon-text">movies & anime</span>
            </h2>
            <p className="text-stream-muted text-lg mb-8">
              Stream anything, anywhere. Upload your own content to your personal library.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setFilter('videos')}
                className="px-6 py-3 bg-gradient-to-r from-stream-neon to-stream-purple text-white font-bold rounded-lg hover:shadow-neon transition-all"
              >
                ▶ Browse Library
              </button>
              <a
                href="#upload"
                className="px-6 py-3 bg-white/5 border border-white/10 text-stream-text font-medium rounded-lg hover:bg-white/10 transition-all"
              >
                Upload Content
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Storage Bar */}
        <div className="bg-stream-panel border border-white/5 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-stream-text uppercase tracking-wider">
              Storage
            </h3>
            <span className="text-xs text-stream-muted">
              {formatBytes(user?.storageUsed || 0)} / {formatBytes(user?.storageLimit || 0)}
            </span>
          </div>
          <div className="w-full bg-stream-dark rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-stream-neon to-stream-cyan rounded-full transition-all"
              style={{ width: `${Math.min(storagePercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-stream-muted mt-2">
            {storagePercentage.toFixed(1)}% used • {formatBytes((user?.storageLimit || 0) - (user?.storageUsed || 0))} free
          </p>
        </div>

        {/* Upload Section */}
        <div id="upload" className="bg-stream-panel border border-white/5 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-stream-text mb-4">
            Upload Content
          </h3>
          <FileUpload onUpload={handleFileUpload} />
        </div>

        {/* Library Grid */}
        <div className="bg-stream-panel border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-stream-text">
              My Library
              <span className="ml-2 text-sm font-normal text-stream-muted">
                ({filteredFiles.length} {filteredFiles.length === 1 ? 'item' : 'items'})
              </span>
            </h3>
            <button
              onClick={fetchFiles}
              className="px-4 py-2 text-sm text-stream-cyan border border-stream-cyan/30 rounded-lg hover:bg-stream-cyan/10 transition-all"
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-stream-neon"></div>
              <p className="mt-4 text-sm text-stream-muted">Loading your library...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-16">{error}</div>
          ) : (
            <FileList
              files={filteredFiles}
              onDelete={handleFileDelete}
              onRefresh={fetchFiles}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;