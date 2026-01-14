import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Hero3D from '../components/Hero3D.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { API_BASE_URL } from '../constants.js';

// Interactive Feature Card Component
const FeatureCard = ({ icon, title, description, details, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={`
        relative h-full bg-white rounded-3xl p-8 border-2 transition-all duration-500
        ${isHovered || isExpanded 
          ? 'border-brand-blue shadow-2xl transform -translate-y-2' 
          : 'border-gray-200 shadow-lg hover:shadow-xl'
        }
      `}>
        {/* Icon Container */}
        <div className={`
          w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center 
          text-white mb-6 transform transition-all duration-500
          ${isHovered || isExpanded ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}
        `}>
          <div className="transform transition-transform duration-500 group-hover:scale-110">
      {icon}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-brand-black transition-colors duration-300">
            {title}
          </h3>
          
          <p className={`
            text-gray-600 leading-relaxed transition-all duration-500
            ${isExpanded ? 'opacity-100 max-h-96' : 'opacity-100 max-h-20'}
          `}>
            {description}
          </p>

          {/* Expanded Details */}
          <div className={`
            overflow-hidden transition-all duration-500
            ${isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}
          `}>
            <p className="text-gray-500 text-sm leading-relaxed pt-4 border-t border-gray-100">
              {details}
            </p>
          </div>

          {/* Expand Indicator */}
          <div className="flex items-center gap-2 pt-2">
            <span className={`
              text-xs font-bold uppercase tracking-wider transition-colors duration-300
              ${isExpanded ? 'text-brand-blue' : 'text-gray-400'}
            `}>
              {isExpanded ? 'Less' : 'Learn More'}
            </span>
            <svg 
              className={`
                w-4 h-4 transition-transform duration-500
                ${isExpanded ? 'rotate-180 text-brand-blue' : 'text-gray-400'}
              `}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Hover Effect Background */}
        <div className={`
          absolute inset-0 rounded-3xl bg-gradient-to-br ${color} opacity-0 
          transition-opacity duration-500 pointer-events-none -z-10
          ${isHovered ? 'opacity-5' : ''}
        `}></div>
      </div>
  </div>
);
};

// Mock products for fallback - adding 4th product
const MOCK_PRODUCTS = [
  {
    _id: "1",
    name: "Classic White Tee",
    price: 29.99,
    description: "The essential white t-shirt. Made from 100% organic heavyweight cotton.",
    stock: 100,
    category: "Basics",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    modelPath: "/tshirt.glb",
    featured: true
  },
  {
    _id: "2",
    name: "Midnight Black Tee",
    price: 34.99,
    description: "Deep, rich black dye that resists fading. Minimalist and sleek.",
    stock: 85,
    category: "Basics",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    modelPath: "/tshirt.glb",
    featured: true
  },
  {
    _id: "3",
    name: "Urban Blue Tee",
    price: 32.99,
    description: "A vibrant blue hue inspired by city lights. Modern cut.",
    stock: 50,
    category: "Streetwear",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    modelPath: "/tshirt.glb",
    featured: true
  },
  {
    _id: "4",
    name: "Vintage Gray Tee",
    price: 31.99,
    description: "Classic gray with a modern twist. Perfect for everyday wear.",
    stock: 75,
    category: "Basics",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80",
    modelPath: "/tshirt.glb",
    featured: true
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          // Filter featured products or take first 4
          const featured = data.filter(p => p.featured).slice(0, 4) || data.slice(0, 4);
          setFeaturedProducts(featured.length > 0 ? featured : MOCK_PRODUCTS.slice(0, 4));
        } else {
          setFeaturedProducts(MOCK_PRODUCTS.slice(0, 4));
        }
      } catch (err) {
        console.warn("Backend unreachable, utilizing Mock Data.");
        setFeaturedProducts(MOCK_PRODUCTS.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="flex flex-col w-full min-w-0">
      {/* Hero Section */}
      <Hero3D />

      {/* New Drops Section */}
      <section className="w-full pt-32 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">Latest Releases</span>
            <h2 className="text-5xl md:text-7xl font-black text-brand-black mb-6 tracking-tight">
              New Drops
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Limited edition designs. Premium quality. Infinite possibilities.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-black"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link 
              to="/shop"
              className="group inline-flex items-center gap-2 text-brand-black font-bold text-lg hover:gap-4 transition-all"
            >
              <span>View All Products</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="w-full pt-16 pb-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-brand-black mb-4 tracking-tight">
              Why Choose Us
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Experience the future of custom apparel design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 3D Preview Card */}
            <FeatureCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
              title="3D Preview"
              description="See your design in real-time before you buy"
              details="Rotate, zoom, and interact with your custom design in full 3D. No surprises, just perfect results."
              color="from-brand-blue to-purple-600"
            />
           {/* Creative Tools Card */}
             <FeatureCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Creative Tools"
              description="Generate unique designs with powerful tools"
              details="Create custom slogans, patterns, and designs with our intuitive design tools. Endless creativity at your fingertips."
              color="from-brand-blue to-purple-600"
            />

            {/* Premium Quality Card */}
             <FeatureCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              title="Premium Quality"
              description="100% organic cotton, sustainably sourced"
              details="Every garment is crafted with care using premium materials. Eco-friendly, durable, and comfortable for everyday wear."
              color="from-brand-blue to-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="w-full py-32 bg-gradient-to-br from-gray-900 via-brand-black to-gray-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-blue/20 to-purple-600/20 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Ready to Create?
          </h2>
          <p className="text-gray-300 text-xl mb-12 max-w-xl mx-auto leading-relaxed">
            Start customizing your perfect t-shirt today. No limits. No boundaries.
          </p>
            <button 
                onClick={() => navigate('/designs')}
            className="group relative px-12 py-5 bg-white text-brand-black rounded-full text-lg font-black hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl overflow-hidden"
            >
            <span className="relative z-10">Start Designing</span>
            <span className="absolute inset-0 bg-gradient-to-r from-brand-blue to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="w-full bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-3xl font-black text-brand-black mb-4">TeeFusion</h3>
              <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                Create custom apparel with powerful 3D design tools. See it before you buy it. 
                Premium quality, sustainable materials.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-black text-brand-black uppercase tracking-wider mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/shop" className="text-gray-600 hover:text-brand-black transition-colors font-medium">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/customizer" className="text-gray-600 hover:text-brand-black transition-colors font-medium">
                    Customizer
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-gray-600 hover:text-brand-black transition-colors font-medium">
                    Cart
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-black transition-colors font-medium">
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-black text-brand-black uppercase tracking-wider mb-6">Support</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-black transition-colors font-medium">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-black transition-colors font-medium">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-black transition-colors font-medium">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-black transition-colors font-medium">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2025 TeeFusion. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-brand-black transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-brand-black transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-brand-black transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
