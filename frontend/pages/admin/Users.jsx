import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { API_BASE_URL } from '../../constants.js';

const Users = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProfilePictureUrl = (user) => {
    if (!user?.profilePicture) return null;
    if (user.profilePicture.startsWith('http')) return user.profilePicture;
    return `${API_BASE_URL}${user.profilePicture}`;
  };

  if (loading) {
    return (
      <AdminLayout title="Users">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Users">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-black mb-2">User Management</h1>
        <p className="text-gray-600">View and manage all registered users</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-700 mb-4">No Users Found</h2>
          <p className="text-gray-500">No users have registered yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-brand-blue to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                          {getProfilePictureUrl(user) ? (
                            <img 
                              src={getProfilePictureUrl(user)} 
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            user.name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-900">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-600">{user.phone || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      {user.address?.street ? (
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">{user.address.street}</p>
                          <p className="text-xs">{user.address.city}, {user.address.postalCode}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">No address</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedUser(selectedUser?._id === user._id ? null : user)}
                        className="text-sm text-brand-blue hover:text-purple-600 font-medium transition-colors"
                      >
                        {selectedUser?._id === user._id ? 'Hide' : 'View'} Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-brand-black">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-blue to-purple-600 flex items-center justify-center text-white text-3xl font-black overflow-hidden flex-shrink-0">
                  {getProfilePictureUrl(selectedUser) ? (
                    <img 
                      src={getProfilePictureUrl(selectedUser)} 
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selectedUser.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-brand-black mb-1">{selectedUser.name}</h3>
                  <p className="text-gray-600 mb-2">{selectedUser.email}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    selectedUser.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedUser.role === 'admin' ? 'Administrator' : 'User'}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-black text-brand-black mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-bold text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-bold text-gray-900">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {selectedUser.address && (selectedUser.address.street || selectedUser.address.city) && (
                <div>
                  <h4 className="text-lg font-black text-brand-black mb-4">Address</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-medium text-gray-900 mb-1">{selectedUser.address.street || 'N/A'}</p>
                    <p className="text-gray-600">
                      {selectedUser.address.city || ''}{selectedUser.address.city && selectedUser.address.postalCode ? ', ' : ''}
                      {selectedUser.address.postalCode || ''}
                    </p>
                    <p className="text-gray-600">{selectedUser.address.country || ''}</p>
                  </div>
                </div>
              )}

              {/* Account Information */}
              <div>
                <h4 className="text-lg font-black text-brand-black mb-4">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">User ID</p>
                    <p className="font-mono text-xs text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">{selectedUser._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Member Since</p>
                    <p className="font-bold text-gray-900">
                      {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Users;

