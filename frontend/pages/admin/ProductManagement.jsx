import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useConfirmation } from '../../context/ConfirmationContext.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { API_BASE_URL } from '../../constants.js';
import ProductModal from '../../components/ProductModal.jsx';

const ProductManagement = () => {
  const { token } = useAuth();
  const { confirm } = useConfirmation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (productData) => {
    try {
      let res;
      if (editingProduct) {
        res = await fetch(`${API_BASE_URL}/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
      } else {
        res = await fetch(`${API_BASE_URL}/api/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
      }

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to save product');
      }
      
      setShowModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      alert(err.message || 'Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });
    
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete product');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <AdminLayout title="Products">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-brand-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Products">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-black text-brand-black">Product Management</h1>
        </div>
        <p className="text-gray-600">Manage all products in your store</p>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-black text-brand-black">Products</h2>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        product={editingProduct}
      />

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Colors</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Total Stock</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const totalStock = product.colorVariants?.reduce((sum, variant) => {
                if (variant.sizeStock && Object.keys(variant.sizeStock).length > 0) {
                  return sum + Object.values(variant.sizeStock).reduce((s, qty) => s + qty, 0);
                }
                return sum + (variant.stock || 0);
              }, 0) || product.stock || 0;

              return (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-brand-black">{product.name}</div>
                        {product.featured && (
                          <span className="text-xs text-brand-blue font-medium">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-brand-black">Rs. {product.price?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {product.colorVariants?.slice(0, 5).map((variant, idx) => (
                        <span
                          key={idx}
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: variant.color }}
                          title={variant.color}
                        ></span>
                      ))}
                      {product.colorVariants?.length > 5 && (
                        <span className="text-xs text-gray-500">+{product.colorVariants.length - 5}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{totalStock}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-xs text-brand-blue hover:text-purple-600 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-12 text-center text-sm text-gray-500">No products found. Click "Add Product" to create one.</div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;
