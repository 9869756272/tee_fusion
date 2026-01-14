import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useConfirmation } from '../../context/ConfirmationContext.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { API_BASE_URL } from '../../constants.js';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAdmin } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirmation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchOrder();
  }, [id, user, token, isAdmin, navigate]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        showToast('Failed to fetch order details', 'error');
        navigate('/admin/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      showToast('Failed to fetch order details', 'error');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    const confirmed = await confirm({
      title: 'Update Order Status',
      message: `Are you sure you want to change the order status to "${newStatus}"?`,
      confirmText: 'Update',
      cancelText: 'Cancel',
      type: 'info',
    });

    if (!confirmed) return;

    setUpdating(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrder(updatedOrder);
        showToast('Order status updated successfully', 'success');
      } else {
        const data = await res.json();
        showToast(data.message || 'Failed to update order status', 'error');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <AdminLayout title="Order Details">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Order Details">
        <div className="text-center py-12">
          <h2 className="text-2xl font-black text-gray-700 mb-4">Order Not Found</h2>
          <Link to="/admin/orders">
            <button className="bg-brand-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
              Back to Orders
            </button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Order Details">
      <div className="mb-8">
        <Link to="/admin/orders" className="inline-flex items-center text-brand-blue hover:text-purple-600 font-bold mb-4">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Orders
        </Link>
        <h1 className="text-3xl font-black text-brand-black mb-2">Order Details</h1>
        <p className="text-gray-600">Order #{order._id.slice(-8).toUpperCase()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-brand-black">Order Status</h2>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl border-2 ${getStatusColor(order.status)}`}>
                <span className="text-lg font-black">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Update Status</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={updating}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {order.isDelivered && order.deliveredAt && (
              <p className="text-sm text-gray-600 mt-4">
                Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-black text-brand-black mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200 relative">
                    {item.customization?.snapshot ? (
                      <>
                        <img src={item.customization.snapshot} alt={item.name} className="w-full h-full object-contain bg-white" />
                        <div className="absolute bottom-0 left-0 w-full bg-brand-blue text-white text-[8px] font-bold text-center py-0.5">CUSTOM</div>
                      </>
                    ) : (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-brand-black text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.qty}</p>
                    {item.customization && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-gray-300" style={{backgroundColor: item.customization.color}}></span>
                        <span className="text-xs text-gray-500">Custom Design</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-black text-brand-black text-lg">Rs. {(item.price * item.qty).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Rs. {item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-black text-brand-black mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold">Rs. {order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-bold">Rs. {order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-bold">Rs. {order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-xl font-black text-brand-black">
                  <span>Total</span>
                  <span>Rs. {order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          {order.user && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-black text-brand-black mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-bold text-gray-900">{order.user.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-bold text-gray-900">{order.user.email || 'N/A'}</p>
                </div>
                {order.user.phone && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-bold text-gray-900">{order.user.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-black text-brand-black mb-4">Shipping Address</h2>
            <div className="text-gray-600 space-y-1">
              <p className="font-medium">{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-black text-brand-black mb-4">Payment Method</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">{order.paymentMethod}</p>
                <p className="text-sm text-gray-500">
                  {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not paid yet'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetails;

