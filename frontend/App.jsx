import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Customizer from './pages/Customizer.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Wishlist from './pages/Wishlist.jsx';
import MyDesigns from './pages/MyDesigns.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Overview from './pages/admin/Overview.jsx';
import OrderManagement from './pages/admin/OrderManagement.jsx';
import AdminOrderDetails from './pages/admin/AdminOrderDetails.jsx';
import ProductManagement from './pages/admin/ProductManagement.jsx';
import Users from './pages/admin/Users.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ConfirmationProvider } from './context/ConfirmationContext.jsx';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-brand-black">
      {!isAdminRoute && <Navbar />}
      <main className={`w-full ${isAdminRoute ? "flex-grow" : "flex-grow pt-20"}`}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/customizer/:id" element={<Customizer />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/cart" 
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/wishlist" 
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/designs" 
                  element={
                    <ProtectedRoute>
                      <MyDesigns />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders/:id" 
                  element={
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin Routes */}
                <Route 
                  path="/admin/overview" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Overview />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <OrderManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders/:id" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminOrderDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <ProductManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Users />
                    </ProtectedRoute>
                  } 
                />
                {/* Redirect old dashboard route to overview */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Overview />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Overview />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <ConfirmationProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <AppContent />
              </Router>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ConfirmationProvider>
    </ToastProvider>
  );
};

export default App;