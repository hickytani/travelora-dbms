import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold tracking-[0.12em]">✈ TRAVELORA</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-100 transition">Home</Link>
            <Link to="/destinations" className="hover:text-blue-100 transition">Destinations</Link>
            <Link to="/packages" className="hover:text-blue-100 transition">Packages</Link>

            {user && user.role === 'customer' && (
              <>
                <Link to="/my-bookings" className="hover:text-blue-100 transition">My Bookings</Link>
                <Link to="/dashboard" className="hover:text-blue-100 transition">Dashboard</Link>
              </>
            )}

            {user && user.role === 'admin' && (
              <Link to="/admin" className="hover:text-blue-100 transition">Admin Panel</Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">Hello, {user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-100 transition">Login</Link>
                <Link
                  to="/register"
                    className="rounded-full bg-lime-200 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block hover:text-blue-100 py-2">Home</Link>
            <Link to="/destinations" className="block hover:text-blue-100 py-2">Destinations</Link>
            <Link to="/packages" className="block hover:text-blue-100 py-2">Packages</Link>

            {user && user.role === 'customer' && (
              <>
                <Link to="/my-bookings" className="block hover:text-blue-100 py-2">My Bookings</Link>
                <Link to="/dashboard" className="block hover:text-blue-100 py-2">Dashboard</Link>
              </>
            )}

            {user && user.role === 'admin' && (
              <Link to="/admin" className="block hover:text-blue-100 py-2">Admin Panel</Link>
            )}

            <div className="pt-2 border-t border-blue-500">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 hover:text-blue-100 py-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link to="/login" className="block hover:text-blue-100 py-2">Login</Link>
                  <Link to="/register" className="block hover:text-blue-100 py-2">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
