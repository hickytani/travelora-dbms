import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('prasun@example.com');
  const [password, setPassword] = useState('password123');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginFn = isAdmin ? authApi.adminLogin : authApi.login;
      const response = await loginFn(email, password);

      const { token, customer, admin } = response.data.data;
      const user = customer || admin;

      login(token, {
        id: user.id,
        email: user.email,
        role: isAdmin ? 'admin' : 'customer',
      });

      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <LogIn size={40} className="mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Admin Login' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="admin" className="text-gray-700">Admin Login</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {!isAdmin && (
          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        )}

        {/* Demo Credentials */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">Demo Credentials:</p>
          <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
            <div>
              <p className="font-semibold">Customer:</p>
              <p className="text-gray-600">Email: prasun@example.com</p>
              <p className="text-gray-600">Password: password123</p>
            </div>
            <div className="pt-2">
              <p className="font-semibold">Admin:</p>
              <p className="text-gray-600">Email: admin@travelora.com</p>
              <p className="text-gray-600">Password: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
