'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CardexLogo from '../components/CardexLogo';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store JWT token and user data in localStorage
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));

        // Also set the old localStorage flags for backward compatibility
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_email', data.user.email);

        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        throw new Error(data.error || 'Login failed');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B5541B] via-[#9B4722] to-[#7a3819] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Logo Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl sm:shadow-2xl mb-4 sm:mb-6">
          <CardexLogo size="medium" />
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
            Admin Login
          </h1>
          <p className="text-sm sm:text-base text-[#B5541B] text-center mb-6 sm:mb-8 font-medium">
            Access CARDEX Management System
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {/* Username */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="
                  w-full px-3 sm:px-4 py-2.5 sm:py-3
                  text-sm sm:text-base text-gray-900 font-medium
                  bg-white border-2 border-gray-300 rounded-xl
                  placeholder:text-gray-400
                  focus:border-[#B5541B] focus:ring-2 sm:focus:ring-4 focus:ring-orange-100
                  focus:outline-none transition-all
                "
              />
              <p className="text-xs text-gray-500 mt-1">Default admin username: admin</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="
                  w-full px-3 sm:px-4 py-2.5 sm:py-3
                  text-sm sm:text-base text-gray-900 font-medium
                  bg-white border-2 border-gray-300 rounded-xl
                  placeholder:text-gray-400
                  focus:border-[#B5541B] focus:ring-2 sm:focus:ring-4 focus:ring-orange-100
                  focus:outline-none transition-all
                "
              />
              <p className="text-xs text-gray-500 mt-1">Default password: admin123</p>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full px-4 sm:px-6 py-3 sm:py-4
                bg-gradient-to-r from-[#B5541B] to-[#9B4722]
                text-white text-base sm:text-lg font-bold rounded-xl
                shadow-lg hover:shadow-xl
                hover:from-[#9B4722] hover:to-[#7a3819]
                focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-orange-300
                disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-200
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Login to Dashboard</span>
                  <span>🔐</span>
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Need access? Contact your administrator
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-white hover:text-orange-200 font-medium transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}