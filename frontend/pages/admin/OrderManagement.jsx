import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useConfirmation } from '../../context/ConfirmationContext.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { API_BASE_URL } from '../../constants.js';

const OrderManagement = () => {
  const { user, token, isAdmin } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirmation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, isAdmin, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        showToast('Failed to fetch orders', 'error');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const confirmed = await confirm({
      title: 'Update Order Status',
      message: `Are you sure you want to change the order status to "${newStatus}"?`,
      confirmText: 'Update',
      cancelText: 'Cancel',
      type: 'info',
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showToast('Order status updated successfully', 'success');
        fetchOrders();
      } else {
        const data = await res.json();
        showToast(data.message || 'Failed to update order status', 'error');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Failed to update order status', 'error');
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

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <AdminLayout title="Order Management">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Orders">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-black mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                filterStatus === 'all'
                  ? 'bg-brand-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Orders
            </button>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-bold transition-colors capitalize ${
                  filterStatus === status
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <h2 className="text-2xl font-black text-gray-700 mb-4">No Orders Found</h2>
            <p className="text-gray-500">
              {filterStatus === 'all' 
                ? 'No orders have been placed yet.' 
                : `No orders with status "${filterStatus}" found.`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-brand-blue to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="text-brand-blue hover:text-purple-600 font-bold"
                        >
                          #{order._id.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-bold text-gray-900">{order.user?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{order.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-700">{order.orderItems.length} items</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-brand-black">Rs. {order.totalPrice.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="text-sm border-2 border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </AdminLayout>
  );
};

export default OrderManagement;

