'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import CardexLogo from '../components/CardexLogo';

export default function AdminDashboard() {
   const [stats, setStats] = useState(null);
   const [clients, setClients] = useState([]);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState('');
   const [statusFilter, setStatusFilter] = useState('');
   const [groupFilter, setGroupFilter] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [selectedClient, setSelectedClient] = useState(null);
   const [editingStatus, setEditingStatus] = useState(false);
   const [statusValue, setStatusValue] = useState('');
   const [user, setUser] = useState(null);
   const [authLoading, setAuthLoading] = useState(true);
   const router = useRouter();

  const downloadCSV = () => {
    if (!clients || clients.length === 0) {
      alert('No data to export');
      return;
    }

    // CSV headers
    const headers = ['Client', 'Travelers', 'Group', 'Status', 'Arrival', 'Submitted'];

    // CSV rows
    const rows = clients.map(client => [
      `"${client.full_name}"`,
      client.number_of_travelers,
      client.group_type,
      client.status,
      client.arrival_date || 'TBD',
      new Date(client.created_at).toLocaleDateString()
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cardex_clients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check authentication on component mount
  useEffect(() => {
    checkUser();
  }, []);

  // Fetch stats and clients after authentication
  useEffect(() => {
    if (user) {
      fetchStats();
      fetchClients();
    }
  }, [user, search, statusFilter, groupFilter, currentPage]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      // Get admin user details
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (!adminUser) {
        router.push('/login');
        return;
      }

      setUser(adminUser);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 50,
        search,
        status: statusFilter,
        group_type: groupFilter
      });

      const response = await fetch(`/api/clients?${params}`);
      const data = await response.json();
      if (data.success) {
        setClients(data.clients);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientClick = async (client) => {
    try {
      // Fetch full client details including notes and history
      const [clientResponse, travelersResponse] = await Promise.all([
        fetch(`/api/clients/${client.id}`),
        fetch(`/api/clients/${client.id}/travelers`)
      ]);

      const clientData = await clientResponse.json();
      const travelersData = await travelersResponse.json();

      if (clientData.success && travelersData.success) {
        setSelectedClient({
          ...clientData.client,
          notes: clientData.notes,
          history: clientData.history,
          travelers: travelersData.travelers
        });
        setStatusValue(clientData.client.status);
        setEditingStatus(false);
      }
    } catch (error) {
      console.error('Failed to fetch client details:', error);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedClient || !statusValue) return;

    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: statusValue }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the selected client with new status
        setSelectedClient(prev => ({ ...prev, status: statusValue }));
        setEditingStatus(false);

        // Refresh the clients list to show updated status
        fetchClients();
      } else {
        alert('Failed to update status: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-moroccan-pattern">
        <div className="text-xl text-morocco-blue-700 bg-white p-8 rounded-xl shadow-moroccan">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⏳</span>
            <span>Loading CARDEX Dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg p-2">
                <CardexLogo size="small" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-blue-200 text-sm">
                  Welcome back, {user?.full_name}
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="text-right">
                <p className="font-semibold">{user?.full_name}</p>
                <p className="text-blue-200 text-sm">{user?.role}</p>
              </div>

              {/* Navigation */}
              <nav className="flex gap-4">
                <a
                  href="/admin/users"
                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <span>👥</span>
                  <span>Manage Users</span>
                </a>
                <a
                  href="/"
                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                >
                  Public Form
                </a>
                <button
                  onClick={downloadCSV}
                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <span>📊</span>
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="
                    px-4 py-2
                    bg-white/10
                    hover:bg-white/20
                    rounded-lg
                    font-medium
                    transition-all
                    flex items-center gap-2
                  "
                >
                  <span>Logout</span>
                  <span>🚪</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards with Travel Icons */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Clients */}
            <div className="bg-white rounded-lg p-4 shadow border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-semibold text-sm">Total Clients</span>
                <span className="text-xl">👥</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.total_clients || 0}</div>
              <div className="text-xs text-gray-500 mt-1">All submissions</div>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-lg p-4 shadow border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-semibold text-sm">Pending</span>
                <span className="text-xl">⏳</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.status_breakdown?.find(s => s.status === 'Pending')?.count || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Awaiting review</div>
            </div>

            {/* Confirmed */}
            <div className="bg-white rounded-lg p-4 shadow border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-semibold text-sm">Confirmed</span>
                <span className="text-xl">✅</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.status_breakdown?.find(s => s.status === 'Confirmed')?.count || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Ready to travel</div>
            </div>

            {/* Total Travelers */}
            <div className="bg-white rounded-lg p-4 shadow border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-semibold text-sm">Total Travelers</span>
                <span className="text-xl">✈️</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.total_group_size || 0}</div>
              <div className="text-xs text-gray-500 mt-1">Including additional guests</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, email, phone..."
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-600 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Type
              </label>
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
              >
                <option value="">All Groups</option>
                <option value="Individual">Individual</option>
                <option value="Family">Family</option>
                <option value="Group">Group</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => {
                  setCurrentPage(1); // Reset to first page when searching
                  fetchClients(); // Trigger search manually
                }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 font-medium"
              >
                Search
              </button>
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setGroupFilter('');
                  setCurrentPage(1);
                }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Client Submissions
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Travelers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Arrival
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => handleClientClick(client)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {client.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.number_of_travelers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.group_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : client.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.arrival_date || 'TBD'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Client Modal */}
        {selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">
                  Client Details: {selectedClient.full_name}
                </h2>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900 mt-1">{selectedClient.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900 mt-1">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Travelers</label>
                    <p className="text-gray-900 mt-1">{selectedClient.number_of_travelers}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Group Type</label>
                    <p className="text-gray-900 mt-1">{selectedClient.group_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    {editingStatus ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={statusValue}
                          onChange={(e) => setStatusValue(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={handleStatusUpdate}
                          className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingStatus(false);
                            setStatusValue(selectedClient.status);
                          }}
                          className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${
                          selectedClient.status === 'Confirmed'
                            ? 'bg-green-100 text-green-800'
                            : selectedClient.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedClient.status}
                        </span>
                        <button
                          onClick={() => setEditingStatus(true)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Travel Details */}
                <div className="border-t pt-6 border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Travel Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Arrival Date</label>
                      <p className="text-gray-900 mt-1">{selectedClient.arrival_date || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Departure Date</label>
                      <p className="text-gray-900 mt-1">{selectedClient.departure_date || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="border-t pt-6 border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedClient.dietary_restrictions?.length > 0
                          ? selectedClient.dietary_restrictions.map(item => (
                              <span key={item} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {item}
                              </span>
                            ))
                          : <span className="text-gray-500">None specified</span>
                        }
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Accessibility Needs</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedClient.accessibility_needs?.length > 0
                          ? selectedClient.accessibility_needs.map(item => (
                              <span key={item} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                {item}
                              </span>
                            ))
                          : <span className="text-gray-500">None specified</span>
                        }
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
                      <p className="text-gray-900 bg-white px-3 py-2 rounded border">
                        {selectedClient.preferred_language || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Food Preferences</label>
                      <p className="text-gray-900 bg-white px-3 py-2 rounded border min-h-[60px]">
                        {selectedClient.food_preferences || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Activities</label>
                      <div className="bg-white border rounded-lg p-3 text-gray-900 min-h-[60px]">
                        {selectedClient.custom_activities || 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Inquiries</label>
                      <div className="bg-white border rounded-lg p-3 text-gray-900 min-h-[60px]">
                        {selectedClient.additional_inquiries || 'Not specified'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Travelers */}
                {selectedClient.travelers && selectedClient.travelers.length > 0 && (
                  <div className="border-t pt-6 border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                      <span className="text-xl">👥</span>
                      Additional Travelers
                    </h3>
                    <div className="space-y-6">
                      {selectedClient.travelers.map((traveler, index) => (
                        <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border-2 border-blue-200 shadow-lg">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {index + 2}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">{traveler.name}</h4>
                              <p className="text-gray-700 font-medium">Traveler {index + 2}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="block text-sm font-semibold text-gray-700 mb-1">Age Group</span>
                              <span className="text-gray-900 bg-white px-3 py-1 rounded border">{traveler.age_group || 'Not specified'}</span>
                            </div>
                            <div>
                              <span className="block text-sm font-semibold text-gray-700 mb-1">Relationship</span>
                              <span className="text-gray-900 bg-white px-3 py-1 rounded border">{traveler.relationship || 'Not specified'}</span>
                            </div>
                            {traveler.email && (
                              <div>
                                <span className="block text-sm font-semibold text-gray-700 mb-1">Email</span>
                                <span className="text-gray-900 bg-white px-3 py-1 rounded border break-all">{traveler.email}</span>
                              </div>
                            )}
                            {traveler.phone && (
                              <div>
                                <span className="block text-sm font-semibold text-gray-700 mb-1">Phone</span>
                                <span className="text-gray-900 bg-white px-3 py-1 rounded border">{traveler.phone}</span>
                              </div>
                            )}
                          </div>

                          {/* Dietary Restrictions */}
                          <div className="mb-4">
                            <span className="block text-sm font-semibold text-gray-700 mb-2">Dietary Restrictions</span>
                            <div className="flex flex-wrap gap-2">
                              {traveler.dietary_restrictions && traveler.dietary_restrictions.length > 0
                                ? traveler.dietary_restrictions.map(restriction => (
                                    <span key={restriction} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium border border-orange-200">
                                      🥗 {restriction}
                                    </span>
                                  ))
                                : <span className="text-gray-500 italic">None specified</span>
                              }
                            </div>
                          </div>

                          {/* Special Notes */}
                          {traveler.special_notes && (
                            <div>
                              <span className="block text-sm font-semibold text-gray-700 mb-2">Special Notes</span>
                              <div className="bg-white border rounded-lg p-3 text-gray-900">
                                {traveler.special_notes}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
