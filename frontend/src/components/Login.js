import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 stream-gradient">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-tight">
            <span className="text-stream-neon neon-text">STREAM</span>
            <span className="text-stream-cyan neon-text-cyan">HUB</span>
          </h1>
          <p className="mt-2 text-stream-muted text-sm">
            Movies & Anime. Worldwide.
          </p>
        </div>

        <div className="bg-stream-panel border border-white/5 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-stream-text mb-6">
            Welcome back
          </h2>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stream-muted mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-stream-dark border border-white/10 rounded-lg text-stream-text placeholder-stream-muted focus:outline-none focus:border-stream-cyan transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stream-muted mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-stream-dark border border-white/10 rounded-lg text-stream-text placeholder-stream-muted focus:outline-none focus:border-stream-cyan transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-stream-neon to-stream-purple text-white font-bold rounded-lg hover:shadow-neon transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stream-muted">
            New to StreamHub?{' '}
            <Link to="/register" className="text-stream-cyan hover:text-stream-neon transition-colors font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;