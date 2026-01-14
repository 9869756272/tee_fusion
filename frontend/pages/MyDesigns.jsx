import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useConfirmation } from '../context/ConfirmationContext.jsx';
import { API_BASE_URL } from '../constants.js';
import state from '../store/index.js';

const MyDesigns = () => {
  const { user } = useAuth();
  const { confirm } = useConfirmation();
  const navigate = useNavigate();
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    // Load saved design from localStorage
    const savedDesign = localStorage.getItem('customizer_save');
    if (savedDesign) {
      try {
        const design = JSON.parse(savedDesign);
        setSavedDesigns([{ ...design, id: 'current', savedAt: new Date().toISOString() }]);
      } catch (err) {
        console.error('Failed to parse saved design:', err);
      }
    }

    // Fetch products for reference
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          const productsArray = Array.isArray(data) ? data : [];
          setProducts(productsArray);
          console.log('Products loaded:', productsArray.length);
        } else {
          console.warn('Failed to fetch products: HTTP', res.status);
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleLoadDesign = (design) => {
    // Load design into state
    Object.assign(state, {
      color: design.color || '#FFFFFF',
      logoDecal: design.logoDecal || '',
      isLogoTexture: !!design.logoDecal,
      logoSize: design.logoSize || 'M',
      logoPlacement: design.logoPlacement || 'center',
      frontText: design.frontText || '',
      frontFontStyle: design.frontFontStyle || 'Arial',
      frontFontSize: design.frontFontSize || 24,
      frontTextPlacement: design.frontTextPlacement || 'center',
      frontTextColor: design.frontTextColor || '#000000',
      backText: design.backText || '',
      backFontStyle: design.backFontStyle || 'Arial',
      backFontSize: design.backFontSize || 24,
      backTextPlacement: design.backTextPlacement || 'center',
      backTextColor: design.backTextColor || '#000000',
    });

    // Navigate to customizer with first product
    if (products.length > 0) {
      navigate(`/customizer/${products[0]._id}`);
    } else {
      navigate('/shop');
    }
  };

  const handleDeleteDesign = async () => {
    const confirmed = await confirm({
      title: 'Delete Design',
      message: 'Are you sure you want to delete this saved design? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });
    
    if (confirmed) {
      localStorage.removeItem('customizer_save');
      setSavedDesigns([]);
    }
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-black text-brand-black mb-4">Please Login</h2>
            <p className="text-gray-500 mb-8">You need to be logged in to view your saved designs.</p>
            <Link to="/login">
              <button className="px-8 py-3 bg-gradient-to-r from-brand-blue to-purple-600 text-white rounded-full font-bold hover:shadow-lg transition-all">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (savedDesigns.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-brand-black mb-8">My Designs</h1>
          <div className="bg-white rounded-2xl p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <h2 className="text-2xl font-black text-brand-black mb-4">No saved designs yet</h2>
            <p className="text-gray-500 mb-8">Create and save your custom designs to see them here!</p>
            <button
              onClick={async () => {
                // Wait if products are still loading
                if (productsLoading) {
                  console.log('Products still loading, waiting...');
                  // Wait a bit for products to load
                  await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                // Use products already fetched in useEffect
                if (products.length > 0) {
                  console.log('Navigating to customizer with product:', products[0]._id);
                  navigate(`/customizer/${products[0]._id}`);
                  return;
                }
                
                // If products not loaded yet, try fetching one more time
                console.log('Products not available, fetching...');
                try {
                  const res = await fetch(`${API_BASE_URL}/api/products`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  if (res.ok) {
                    const fetchedProducts = await res.json();
                    const productsArray = Array.isArray(fetchedProducts) ? fetchedProducts : [];
                    
                    if (productsArray.length > 0) {
                      console.log('Products fetched, navigating to:', productsArray[0]._id);
                      setProducts(productsArray);
                      navigate(`/customizer/${productsArray[0]._id}`);
                    } else {
                      // No products available, go to shop
                      console.warn('No products available, redirecting to shop');
                      navigate('/shop');
                    }
                  } else {
                    // API error but not network error
                    console.error('API returned error:', res.status);
                    // Still try shop as fallback
                    navigate('/shop');
                  }
                } catch (err) {
                  // Network error or API unavailable
                  console.error('Failed to fetch products:', err);
                  // Show error but still allow navigation to shop
                  alert('Unable to load products. Please check your connection and try again.');
                  navigate('/shop');
                }
              }}
              disabled={productsLoading}
              className={`px-8 py-3 bg-gradient-to-r from-brand-blue to-purple-600 text-white rounded-full font-bold hover:shadow-lg transition-all ${
                productsLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {productsLoading ? 'Loading...' : 'Start Designing'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-brand-black">My Designs</h1>
          <button
            onClick={async () => {
              // Wait if products are still loading
              if (productsLoading) {
                console.log('Products still loading, waiting...');
                await new Promise(resolve => setTimeout(resolve, 500));
              }
              
              // Use products already fetched in useEffect
              if (products.length > 0) {
                console.log('Navigating to customizer with product:', products[0]._id);
                navigate(`/customizer/${products[0]._id}`);
                return;
              }
              
              // If products not loaded yet, try fetching one more time
              console.log('Products not available, fetching...');
              try {
                const res = await fetch(`${API_BASE_URL}/api/products`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                
                if (res.ok) {
                  const fetchedProducts = await res.json();
                  const productsArray = Array.isArray(fetchedProducts) ? fetchedProducts : [];
                  
                  if (productsArray.length > 0) {
                    console.log('Products fetched, navigating to:', productsArray[0]._id);
                    setProducts(productsArray);
                    navigate(`/customizer/${productsArray[0]._id}`);
                  } else {
                    // No products available, go to shop
                    console.warn('No products available, redirecting to shop');
                    navigate('/shop');
                  }
                } else {
                  // API error but not network error
                  console.error('API returned error:', res.status);
                  navigate('/shop');
                }
              } catch (err) {
                // Network error or API unavailable
                console.error('Failed to fetch products:', err);
                alert('Unable to load products. Please check your connection and try again.');
                navigate('/shop');
              }
            }}
            disabled={productsLoading}
            className={`px-6 py-3 bg-gradient-to-r from-brand-blue to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all ${
              productsLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {productsLoading ? 'Loading...' : 'Create New Design'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedDesigns.map((design) => (
            <div key={design.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              {/* Design Preview */}
              <div className="bg-gray-100 rounded-xl h-64 mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="text-center w-full p-4">
                  <div
                    className="w-32 h-40 mx-auto rounded-lg mb-2 border-2 border-gray-300 shadow-md relative"
                    style={{ backgroundColor: design.color || '#FFFFFF' }}
                  >
                    {design.logoDecal && (
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">Logo</div>
                    )}
                    {design.frontText && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-bold px-2 truncate max-w-full"
                        style={{ 
                          color: design.frontTextColor || '#000000',
                          fontFamily: design.frontFontStyle || 'Arial',
                          fontSize: `${Math.min(design.frontFontSize || 24, 16)}px`
                        }}>
                        {design.frontText}
                      </div>
                    )}
                  </div>
                  {design.backText && (
                    <p className="text-xs text-gray-500 mt-1">Back: {design.backText}</p>
                  )}
                </div>
              </div>

              {/* Design Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Color:</span>
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: design.color || '#FFFFFF' }}
                  ></div>
                </div>
                {design.frontText && (
                  <div>
                    <span className="text-xs font-bold text-gray-500">Front Text:</span>
                    <p className="text-sm text-gray-700 truncate">{design.frontText}</p>
                  </div>
                )}
                {design.backText && (
                  <div>
                    <span className="text-xs font-bold text-gray-500">Back Text:</span>
                    <p className="text-sm text-gray-700 truncate">{design.backText}</p>
                  </div>
                )}
                {design.logoDecal && (
                  <div>
                    <span className="text-xs font-bold text-gray-500">Logo:</span>
                    <span className="text-sm text-gray-700 ml-2">Yes</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleLoadDesign(design)}
                  className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm"
                >
                  Load Design
                </button>
                <button
                  onClick={handleDeleteDesign}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyDesigns;

