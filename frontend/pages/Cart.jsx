import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useConfirmation } from '../context/ConfirmationContext.jsx';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const { confirm } = useConfirmation();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!user) {
      // Redirect to login but maybe store intent to checkout
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <h2 className="text-3xl font-black text-brand-black mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any style yet.</p>
        <Link to="/shop">
          <button className="bg-brand-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
            Start Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-brand-black mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-200">
                   {item.customization ? (
                       <>
                        <img src={item.customization.snapshot} alt={item.name} className="w-full h-full object-contain bg-white" />
                        <div className="absolute bottom-0 left-0 w-full bg-brand-blue text-white text-[10px] font-bold text-center py-1 tracking-widest">CUSTOM</div>
                       </>
                   ) : (
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                   )}
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-brand-black">{item.name}</h3>
                  {item.customization && (
                      <div className="text-xs text-gray-500 mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex items-center justify-center sm:justify-start gap-1">
                             <span>Base Color:</span>
                             <span className="w-4 h-4 rounded-full border border-gray-200 block shadow-sm" style={{backgroundColor: item.customization.color}}></span>
                          </div>
                          {item.customization.decalUrl && <span className="bg-gray-100 px-2 py-0.5 rounded-md">Custom Decal</span>}
                      </div>
                  )}
                  <p className="text-xl font-bold text-brand-black mt-3">Rs. {item.price}</p>
                </div>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button
                      onClick={() => updateQuantity(item.product, item.customization, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors text-gray-600 hover:text-brand-black"
                      disabled={item.qty <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="font-bold text-brand-black min-w-[2rem] text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(item.product, item.customization, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors text-gray-600 hover:text-brand-black"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <button 
                    onClick={async () => {
                      const confirmed = await confirm({
                        title: 'Remove Item',
                        message: `Are you sure you want to remove "${item.name}" from your cart?`,
                        confirmText: 'Remove',
                        cancelText: 'Cancel',
                        type: 'warning',
                      });
                      if (confirmed) {
                        removeFromCart(item.product, item.customization);
                      }
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-black text-brand-black mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-lg font-black text-brand-black pt-4 border-t border-gray-100">
                  <span>Total</span>
                  <span>Rs. {cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleProceedToCheckout}
                className="w-full bg-brand-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-lg transform hover:-translate-y-0.5"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;