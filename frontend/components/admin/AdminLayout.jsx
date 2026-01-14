import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_BASE_URL } from '../../constants.js';

const AdminLayout = ({ children, title = 'Admin Panel' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getProfilePictureUrl = (user) => {
    if (!user?.profilePicture) return null;
    if (user.profilePicture.startsWith('http')) return user.profilePicture;
    return `${API_BASE_URL}${user.profilePicture}`;
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Side Panel */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r border-gray-200 bg-white">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-white">
            <Link to="/" className="text-xl font-black text-brand-black hover:opacity-80 transition-opacity">
              Tee<span className="text-brand-blue">Fusion</span>
            </Link>
          </div>

          {/* User */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                {getProfilePictureUrl(user) ? (
                  <img 
                    src={getProfilePictureUrl(user)} 
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'A'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-brand-black truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@teefusion.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 flex flex-col space-y-1 overflow-y-auto">
            <Link
              to="/admin/overview"
              className={`block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === '/admin/overview'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-brand-black hover:bg-gray-50'
              }`}
            >
              Overview
            </Link>
            <Link
              to="/admin/orders"
              className={`block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname.startsWith('/admin/orders')
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-brand-black hover:bg-gray-50'
              }`}
            >
              Orders
            </Link>
            <Link
              to="/admin/products"
              className={`block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === '/admin/products'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-brand-black hover:bg-gray-50'
              }`}
            >
              Products
            </Link>
            <Link
              to="/admin/users"
              className={`block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === '/admin/users'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-brand-black hover:bg-gray-50'
              }`}
            >
              Users
            </Link>
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-1 mt-auto bg-white">
            <Link
              to="/"
              className="block px-4 py-2.5 text-sm text-gray-600 hover:text-brand-black transition-colors rounded-lg hover:bg-gray-50"
            >
              Back to Shop
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
          <h1 className="text-xl font-black text-brand-black">{title}</h1>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

