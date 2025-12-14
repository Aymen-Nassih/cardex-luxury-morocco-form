'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'viewer',
    can_modify: false,
    can_delete: false
  });

  useEffect(() => {
    loadUsers();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .single();
      setCurrentUser(data);
    }
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setUsers(data);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      // 1. Create auth user in Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Add to admin_users table
      const { error: dbError } = await supabase
        .from('admin_users')
        .insert({
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          can_modify: formData.can_modify,
          can_delete: formData.can_delete,
          created_by: currentUser?.id
        });

      if (dbError) throw dbError;

      // Success
      alert('User added successfully! They will receive a confirmation email.');
      setShowAddModal(false);
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'viewer',
        can_modify: false,
        can_delete: false
      });
      loadUsers();

    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!confirm(`Are you sure you want to delete user: ${email}?`)) {
      return;
    }

    try {
      // Delete from admin_users (auth user needs to be deleted via admin API)
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      alert('User deleted successfully');
      loadUsers();

    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user: ' + error.message);
    }
  };

  // Only admins can access this page
  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <p className="text-yellow-800 font-semibold">
            ⚠️ Access Denied: Only administrators can manage users
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage admin users and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="
            px-6 py-3
            bg-blue-600 text-white
            rounded-xl font-semibold
            hover:bg-blue-700
            shadow-lg hover:shadow-xl
            transition-all
          "
        >
          ➕ Add New User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Email</th>
              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Role</th>
              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Permissions</th>
              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900 font-medium">{user.full_name}</td>
                <td className="px-6 py-4 text-gray-700">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-semibold
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}
                  `}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {user.can_modify && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Modify
                      </span>
                    )}
                    {user.can_delete && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        Delete
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.id !== currentUser?.id && (
                    <button
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New User</h2>

            <form onSubmit={handleAddUser} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">Password</label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.can_modify}
                    onChange={(e) => setFormData({...formData, can_modify: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-gray-800 font-medium">Can Modify Records</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.can_delete}
                    onChange={(e) => setFormData({...formData, can_delete: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-gray-800 font-medium">Can Delete Records</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}