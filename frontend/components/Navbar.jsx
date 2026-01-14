import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useConfirmation } from '../context/ConfirmationContext.jsx';
import { API_BASE_URL } from '../constants.js';

const getProfilePictureUrl = (user) => {
  if (!user?.profilePicture) return null;
  if (user.profilePicture.startsWith('http')) return user.profilePicture;
  return `${API_BASE_URL}${user.profilePicture}`;
};

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { showToast } = useToast();
  const { confirm } = useConfirmation();
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      type: 'warning',
    });
    
    if (confirmed) {
      logout();
      setIsProfileMenuOpen(false);
      showToast('Logged out successfully', 'info');
      navigate('/login');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex flex-col items-center cursor-pointer group gap-1" 
            onClick={() => navigate('/')}
          >
            {/* T-Shirt Icon */}
            <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-9 w-9" 
                viewBox="0 0 24 24" 
                fill="none"
                stroke="url(#shirtGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <defs>
                  <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#9333EA" />
                  </linearGradient>
                </defs>
                <path d="M4 4h5l1 3h4l1-3h5v2h-2.5l-1.5 6H8L6.5 6H4V4z" />
                <path d="M4 12v8h16v-8" />
              </svg>
            </div>
            {/* Logo Text */}
            <span className="text-xs font-black tracking-tight text-brand-black transition-transform duration-300 group-hover:scale-105">
              Tee<span className="bg-gradient-to-r from-brand-blue to-purple-600 bg-clip-text text-transparent">Fusion</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-brand-blue'
                    : 'text-gray-600 hover:text-brand-black'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-blue rounded-full"></span>
                )}
                <span className="absolute inset-0 bg-gradient-to-r from-brand-blue/10 to-purple-600/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            ))}
            <Link
              to="/designs"
              className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                location.pathname === '/designs'
                  ? 'text-brand-blue'
                  : 'text-gray-600 hover:text-brand-black'
              }`}
            >
              Design
              {location.pathname === '/designs' && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-blue rounded-full"></span>
              )}
              <span className="absolute inset-0 bg-gradient-to-r from-brand-blue/10 to-purple-600/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            {user && user.role === 'admin' && (
              <Link
                to="/admin/overview"
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-brand-blue'
                    : 'text-gray-600 hover:text-brand-black'
                }`}
              >
                Admin
                {location.pathname.startsWith('/admin') && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-blue rounded-full"></span>
                )}
                <span className="absolute inset-0 bg-gradient-to-r from-brand-blue/10 to-purple-600/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            )}
          </div>

          {/* Icons / Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Cart Icon */}
            <Link 
              to="/cart"
              className="relative p-2.5 text-gray-600 hover:text-brand-black transition-all duration-300 rounded-xl hover:bg-gray-100/50 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-brand-blue to-purple-600 text-[10px] font-bold text-white ring-2 ring-white shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Menu */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white group-hover:ring-brand-blue/50 transition-all duration-300 group-hover:scale-110 overflow-hidden">
                    {getProfilePictureUrl(user) ? (
                      <img 
                        src={getProfilePictureUrl(user)} 
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-brand-blue/5 to-purple-600/5">
                      <p className="text-sm font-bold text-brand-black">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-brand-blue/10 hover:to-purple-600/10 hover:text-brand-black transition-all duration-200 group"
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-brand-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-brand-blue/10 hover:to-purple-600/10 hover:text-brand-black transition-all duration-200 group"
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-brand-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Orders
                      </Link>
                      <Link
                        to="/designs"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-brand-blue/10 hover:to-purple-600/10 hover:text-brand-black transition-all duration-200 group"
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-brand-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        My Designs
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-brand-blue/10 hover:to-purple-600/10 hover:text-brand-black transition-all duration-200 group"
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-brand-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        My Wishlist
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 group"
                      >
                        <svg className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="px-6 py-2.5 bg-gradient-to-r from-brand-blue to-purple-600 text-white text-sm font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {user && (
              <Link to="/cart" className="relative p-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full bg-brand-blue text-[10px] font-bold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-brand-black focus:outline-none rounded-lg hover:bg-gray-100/50 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-brand-blue bg-gradient-to-r from-brand-blue/10 to-purple-600/10'
                    : 'text-gray-600 hover:text-brand-black hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/designs"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                location.pathname === '/designs'
                  ? 'text-brand-blue bg-gradient-to-r from-brand-blue/10 to-purple-600/10'
                  : 'text-gray-600 hover:text-brand-black hover:bg-gray-50'
              }`}
            >
              Design
            </Link>
            {user && user.role === 'admin' && (
              <Link
                to="/admin/overview"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-brand-blue bg-gradient-to-r from-brand-blue/10 to-purple-600/10'
                    : 'text-gray-600 hover:text-brand-black hover:bg-gray-50'
                }`}
              >
                Admin Panel
              </Link>
            )}
            {user && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:text-brand-black hover:bg-gray-50 transition-all"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:text-brand-black hover:bg-gray-50 transition-all"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  My Orders
                </Link>
                 <Link
                   to="/designs"
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="flex items-center px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:text-brand-black hover:bg-gray-50 transition-all"
                 >
                   <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                   </svg>
                   My Designs
                 </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:text-brand-black hover:bg-gray-50 transition-all"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  My Wishlist
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 transition-all"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}
            {!user && (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-brand-blue to-purple-600 text-center hover:shadow-lg transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;