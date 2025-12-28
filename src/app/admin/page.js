'use client';

import { useState, useEffect } from 'react';
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

  const downloadCSV = async () => {
    if (!clients || clients.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      // CSV headers - expanded to include more comprehensive information
      const headers = [
        'Client Name', 'Email', 'Phone', 'Age', 'Number of Travelers', 'Group Type',
        'Occasion Description', 'Arrival Date', 'Departure Date', 'Flight Number',
        'Arrival Time', 'City of Arrival', 'Dietary Restrictions', 'Accessibility Needs',
        'Preferred Language', 'Custom Activities', 'Food Preferences', 'Additional Inquiries',
        'Additional Travelers Travel Info', 'Status', 'Submitted Date'
      ];

      // CSV rows - get full details for each client
      const rows = await Promise.all(clients.map(async (client) => {
        try {
          // Fetch full client details
          const [clientResponse, travelersResponse] = await Promise.all([
            fetch(`/api/clients/${client.id}`),
            fetch(`/api/clients/${client.id}/travelers`)
          ]);

          const clientData = await clientResponse.json();
          const travelersData = await travelersResponse.json();

          if (!clientData.success) {
            // Fallback to basic info if detailed fetch fails
            return [
              `"${client.full_name}"`,
              client.email || '',
              client.phone || '',
              client.age || '',
              client.number_of_travelers || '',
              client.group_type || '',
              '', '', '', '', '', '', '', '', '', '', '', '', '',
              client.status || '',
              new Date(client.created_at).toLocaleString()
            ];
          }

          // Extract traveler travel information for CSV
          const travelerTravelInfo = [];
          if (travelersData.success && travelersData.travelers.length > 0) {
            travelersData.travelers.forEach((traveler, index) => {
              if (traveler.has_different_travel) {
                travelerTravelInfo.push(
                  `Traveler ${index + 2}: ${traveler.name} - ` +
                  `Arrival: ${traveler.arrival_date || 'N/A'}, ` +
                  `Departure: ${traveler.departure_date || 'N/A'}, ` +
                  `Flight: ${traveler.flight_number || 'N/A'}, ` +
                  `Time: ${traveler.arrival_time || 'N/A'}, ` +
                  `City: ${(traveler.city_of_arrival ? (() => {
                    const cityMap = {
                      'CMN': 'Casablanca',
                      'RAK': 'Marrakech',
                      'FEZ': 'Fes',
                      'TNG': 'Tangier',
                      'RBA': 'Rabat',
                      'AGA': 'Agadir',
                      'ESU': 'Essaouira',
                      'OZZ': 'Ouarzazate',
                      'NDR': 'Nador',
                      'OUD': 'Oujda'
                    };
                    return cityMap[traveler.city_of_arrival] || traveler.city_of_arrival;
                  })() : 'N/A')}`
                );
              } else {
                travelerTravelInfo.push(`Traveler ${index + 2}: ${traveler.name} - Same flight as main group`);
              }
            });
          }

          // Format dietary restrictions
          const dietaryRestrictions = (() => {
            try {
              const restrictions = typeof clientData.client.dietary_restrictions === 'string'
                ? JSON.parse(clientData.client.dietary_restrictions || '[]')
                : (clientData.client.dietary_restrictions || []);
              return restrictions.join('; ') || 'None';
            } catch (e) {
              return 'None';
            }
          })();

          // Format accessibility needs
          const accessibilityNeeds = (() => {
            try {
              const needs = typeof clientData.client.accessibility_needs === 'string'
                ? JSON.parse(clientData.client.accessibility_needs || '[]')
                : (clientData.client.accessibility_needs || []);
              return needs.join('; ') || 'None';
            } catch (e) {
              return 'None';
            }
          })();

          return [
            `"${clientData.client.full_name}"`,
            `"${clientData.client.email || ''}"`,
            `"${clientData.client.phone || ''}"`,
            clientData.client.age || '',
            clientData.client.number_of_travelers || '',
            `"${clientData.client.group_type || ''}"`,
            `"${clientData.client.occasion_description || ''}"`,
            clientData.client.arrival_date || '',
            clientData.client.departure_date || '',
            `"${clientData.client.flight_number || ''}"`,
            clientData.client.arrival_time || '',
            `"${clientData.client.city_of_arrival || ''}"`,
            `"${dietaryRestrictions}"`,
            `"${accessibilityNeeds}"`,
            `"${clientData.client.preferred_language || ''}"`,
            `"${clientData.client.custom_activities || ''}"`,
            `"${clientData.client.food_preferences || ''}"`,
            `"${clientData.client.additional_inquiries || ''}"`,
            `"${travelerTravelInfo.join('; ')}"`,
            clientData.client.status || '',
            new Date(clientData.client.created_at).toLocaleString()
          ];
        } catch (error) {
          console.error('Error fetching client details for CSV:', error);
          // Fallback to basic info
          return [
            `"${client.full_name}"`,
            client.email || '',
            client.phone || '',
            client.age || '',
            client.number_of_travelers || '',
            client.group_type || '',
            '', '', '', '', '', '', '', '', '', '', '', '', '', '',
            client.status || '',
            new Date(client.created_at).toLocaleString()
          ];
        }
      }));

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `cardex_clients_complete_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download CSV:', error);
      alert('Failed to download CSV. Please try again.');
    }
  };

  const downloadClientCSV = async (client) => {
    try {
      // Fetch full client details
      const [clientResponse, travelersResponse] = await Promise.all([
        fetch(`/api/clients/${client.id}`),
        fetch(`/api/clients/${client.id}/travelers`)
      ]);

      const clientData = await clientResponse.json();
      const travelersData = await travelersResponse.json();

      if (!clientData.success) {
        alert('Failed to fetch client data');
        return;
      }

      // CSV headers
      const headers = [
        'Field', 'Value'
      ];

      // Basic client info
      const rows = [
        ['Client Name', clientData.client.full_name],
        ['Email', clientData.client.email],
        ['Phone', clientData.client.phone],
        ['Age', clientData.client.age || 'Not specified'],
        ['Number of Travelers', clientData.client.number_of_travelers],
        ['Group Type', clientData.client.group_type],
        ['Occasion Description', clientData.client.occasion_description || 'Not specified'],
        ['Arrival Date', clientData.client.arrival_date || 'Not specified'],
        ['Departure Date', clientData.client.departure_date || 'Not specified'],
        ['Flight Number', clientData.client.flight_number || 'Not specified'],
        ['Arrival Time', clientData.client.arrival_time || 'Not specified'],
        ['City of Arrival', clientData.client.city_of_arrival || 'Not specified'],
        ['Dietary Restrictions', (() => {
          try {
            const restrictions = typeof clientData.client.dietary_restrictions === 'string' 
              ? JSON.parse(clientData.client.dietary_restrictions || '[]')
              : (clientData.client.dietary_restrictions || []);
            return restrictions.join('; ') || 'None';
          } catch (e) {
            return 'None';
          }
        })()],
        ['Accessibility Needs', (() => {
          try {
            const needs = typeof clientData.client.accessibility_needs === 'string'
              ? JSON.parse(clientData.client.accessibility_needs || '[]')
              : (clientData.client.accessibility_needs || []);
            return needs.join('; ') || 'None';
          } catch (e) {
            return 'None';
          }
        })()],
        ['Preferred Language', clientData.client.preferred_language || 'Not specified'],
        ['Custom Activities', clientData.client.custom_activities || 'Not specified'],
        ['Food Preferences', clientData.client.food_preferences || 'Not specified'],
        ['Additional Inquiries', clientData.client.additional_inquiries || 'Not specified'],
        ['Status', clientData.client.status],
        ['Submitted Date', new Date(clientData.client.created_at).toLocaleString()],
      ];

      // Add travelers if any
      if (travelersData.success && travelersData.travelers.length > 0) {
        rows.push(['', '']); // Empty row separator
        rows.push(['Additional Travelers', '']);
        travelersData.travelers.forEach((traveler, index) => {
          rows.push([`Traveler ${index + 2} Name`, traveler.name]);
          rows.push([`Traveler ${index + 2} Age`, traveler.age || 'Not specified']);
          rows.push([`Traveler ${index + 2} Relationship`, traveler.relationship || 'Not specified']);
          rows.push([`Traveler ${index + 2} Email`, traveler.email || 'Not specified']);
          rows.push([`Traveler ${index + 2} Phone`, traveler.phone || 'Not specified']);
          
          // Travel information
          rows.push([`Traveler ${index + 2} Has Different Travel`, traveler.has_different_travel ? 'Yes' : 'No']);
          if (traveler.has_different_travel) {
            rows.push([`Traveler ${index + 2} Arrival Date`, traveler.arrival_date || 'Not specified']);
            rows.push([`Traveler ${index + 2} Departure Date`, traveler.departure_date || 'Not specified']);
            rows.push([`Traveler ${index + 2} Flight Number`, traveler.flight_number || 'Not specified']);
            rows.push([`Traveler ${index + 2} Arrival Time`, traveler.arrival_time || 'Not specified']);
            rows.push([`Traveler ${index + 2} City of Arrival`, (() => {
              const cityMap = {
                'CMN': 'Casablanca (CMN)',
                'RAK': 'Marrakech (RAK)',
                'FEZ': 'Fes (FEZ)',
                'TNG': 'Tangier (TNG)',
                'RBA': 'Rabat (RBA)',
                'AGA': 'Agadir (AGA)',
                'ESU': 'Essaouira (ESU)',
                'OZZ': 'Ouarzazate (OZZ)',
                'NDR': 'Nador (NDR)',
                'OUD': 'Oujda (OUD)'
              };
              return cityMap[traveler.city_of_arrival] || (traveler.city_of_arrival || 'Not specified');
            })()]);
          }
          
          rows.push([`Traveler ${index + 2} Dietary Restrictions`, (() => {
            try {
              const restrictions = typeof traveler.dietary_restrictions === 'string'
                ? JSON.parse(traveler.dietary_restrictions || '[]')
                : (traveler.dietary_restrictions || []);
              return restrictions.join('; ') || 'None';
            } catch (e) {
              return 'None';
            }
          })()]);
          rows.push([`Traveler ${index + 2} Special Notes`, traveler.special_notes || 'Not specified']);
        });
      }

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${client.full_name.replace(/[^a-zA-Z0-9]/g, '_')}_details_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download client CSV:', error);
      alert('Failed to download client data. Please try again.');
    }
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
      // Check localStorage for admin login
      const isLoggedIn = localStorage.getItem('admin_logged_in');
      const adminEmail = localStorage.getItem('admin_email');

      if (!isLoggedIn || !adminEmail) {
        router.push('/login');
        return;
      }

      // Set mock admin user for local development
      setUser({
        email: adminEmail,
        full_name: 'Admin User',
        role: 'Administrator',
        can_modify: true,
        can_delete: true
      });
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_email');
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
        setClients(data.clients || []);
        setTotalPages(data.total_pages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientClick = async (client) => {
    try {
      // Fetch full client details including notes and travelers
      const [clientResponse, travelersResponse] = await Promise.all([
        fetch(`/api/clients/${client.id}`),
        fetch(`/api/clients/${client.id}/travelers`)
      ]);

      const clientData = await clientResponse.json();
      const travelersData = await travelersResponse.json();

      if (clientData.success && travelersData.success) {
        setSelectedClient({
          ...clientData.client,
          notes: clientData.notes || [],
          travelers: travelersData.travelers
        });
        setStatusValue(clientData.client.status);
        setEditingStatus(false);
      } else if (clientData.success) {
        // Handle case where travelers API fails but client data is available
        setSelectedClient({
          ...clientData.client,
          notes: clientData.notes || [],
          travelers: []
        });
        setStatusValue(clientData.client.status);
        setEditingStatus(false);
      } else {
        console.error('Client API failed:', clientData.error);
        alert('Failed to load client details: ' + (clientData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to fetch client details:', error);
      alert('Failed to fetch client details. Please try again.');
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

        // Refresh the clients list and stats to show updated status
        fetchClients();
        fetchStats();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-900 bg-white p-8 rounded-xl shadow-lg border">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⏳</span>
            <span className="font-semibold">Loading Admin Dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 admin-panel">
      {/* Header */}
      <header className="bg-[#B5541B] text-white shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Title Section */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <div className="bg-white rounded-lg p-1.5 sm:p-2">
                <CardexLogo size="small" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Admin Dashboard</h1>
                <p className="text-orange-200 text-xs sm:text-sm truncate">
                  Welcome back, {user?.full_name}
                </p>
              </div>
            </div>

            {/* User Info and Navigation */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              {/* User Info - Hidden on very small screens */}
              <div className="hidden sm:block text-right">
                <p className="font-semibold text-sm">{user?.full_name}</p>
                <p className="text-orange-200 text-xs">{user?.role}</p>
              </div>

              {/* Navigation - Responsive */}
              <nav className="flex gap-1 sm:gap-2 md:gap-4">
                <a
                  href="/admin/users"
                  className="hidden md:flex px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all items-center gap-2 text-sm"
                >
                  <span>👥</span>
                  <span className="hidden lg:inline">Manage Users</span>
                </a>
                <a
                  href="/"
                  className="hidden sm:flex px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm"
                >
                  <span className="hidden lg:inline">Public </span>Form
                </a>
                <button
                  onClick={downloadCSV}
                  className="px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 text-sm"
                  title="Download All CSV"
                >
                  <span>📊</span>
                  <span className="hidden lg:inline">CSV</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all flex items-center gap-2 text-sm"
                  title="Logout"
                >
                  <span className="hidden lg:inline">Logout</span>
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
            <div className="bg-white rounded-lg p-4 shadow border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-800 font-semibold text-sm">Total Clients</span>
                <span className="text-xl">👥</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.total_clients || 0}</div>
              <div className="text-xs text-gray-700 mt-1 font-medium">All submissions</div>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-lg p-4 shadow border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-800 font-semibold text-sm">Pending</span>
                <span className="text-xl">⏳</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.by_status?.Pending || 0}
              </div>
              <div className="text-xs text-gray-700 mt-1 font-medium">Awaiting review</div>
            </div>

            {/* Confirmed */}
            <div className="bg-white rounded-lg p-4 shadow border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-800 font-semibold text-sm">Confirmed</span>
                <span className="text-xl">✅</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.by_status?.Confirmed || 0}
              </div>
              <div className="text-xs text-gray-700 mt-1 font-medium">Ready to travel</div>
            </div>

            {/* Total Travelers */}
            <div className="bg-white rounded-lg p-4 shadow border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-800 font-semibold text-sm">Total Travelers</span>
                <span className="text-xl">✈️</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.total_group_size || 0}</div>
              <div className="text-xs text-gray-700 mt-1 font-medium">Including additional guests</div>
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
                className="w-full p-2 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder:text-gray-600 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-900"
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
                className="w-full p-2 border border-gray-300 rounded bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-900"
              >
                <option value="">All Groups</option>
                <option value="Individual">Individual</option>
                <option value="Family">Family</option>
                <option value="Couple">Couple</option>
                <option value="Special Occasion">Special Occasion</option>
                <option value="Honeymooner">Honeymooner</option>
                <option value="Group">Group</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => {
                  setCurrentPage(1); // Reset to first page when searching
                  fetchClients(); // Trigger search manually
                }}
                className="flex-1 bg-[#B5541B] text-white px-4 py-2 rounded hover:bg-[#9B4722] font-medium"
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
                className="flex-1 bg-[#9B4722] text-white px-4 py-2 rounded hover:bg-[#7a3819] font-medium"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
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
                        <div className="text-sm text-gray-700">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          downloadClientCSV(client);
                        }}
                        className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors flex items-center gap-1"
                        title="Download client CSV"
                      >
                        <span>📊</span>
                        <span className="hidden sm:inline">CSV</span>
                      </button>
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
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900 mt-1 font-semibold">{selectedClient.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <p className="text-gray-900 mt-1">{selectedClient.age || 'Not specified'}</p>
                  </div>
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
                  {(selectedClient.group_type === 'Other' || selectedClient.group_type === 'Special Occasion' || selectedClient.group_type === 'Honeymooner' || selectedClient.occasion_description) && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {selectedClient.group_type === 'Other' ? 'Other Description' :
                         selectedClient.group_type === 'Special Occasion' ? 'Special Occasion Details' :
                         selectedClient.group_type === 'Honeymooner' ? 'Honeymoon Details' : 'Occasion Description'}
                      </label>
                      <p className="text-gray-900 mt-1 bg-orange-50 p-3 rounded-lg border border-orange-200">
                        {selectedClient.occasion_description || <span className="text-gray-500 italic">Not specified</span>}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    {editingStatus ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={statusValue}
                          onChange={(e) => setStatusValue(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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
                          className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 font-medium"
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Flight Number</label>
                      <p className="text-gray-900 mt-1">{selectedClient.flight_number || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
                      <p className="text-gray-900 mt-1">{selectedClient.arrival_time || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City of Arrival</label>
                      <p className="text-gray-900 mt-1">{selectedClient.city_of_arrival || 'Not specified'}</p>
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
                        {(() => {
                          let restrictions = [];
                          try {
                            restrictions = typeof selectedClient.dietary_restrictions === 'string' 
                              ? JSON.parse(selectedClient.dietary_restrictions || '[]')
                              : (selectedClient.dietary_restrictions || []);
                          } catch (e) {
                            restrictions = [];
                          }
                          return restrictions.length > 0
                            ? restrictions.map(item => (
                                <span key={item} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                                  {item}
                                </span>
                              ))
                            : <span className="text-gray-500">None specified</span>;
                        })()}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Accessibility Needs</label>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          let needs = [];
                          try {
                            needs = typeof selectedClient.accessibility_needs === 'string'
                              ? JSON.parse(selectedClient.accessibility_needs || '[]')
                              : (selectedClient.accessibility_needs || []);
                          } catch (e) {
                            needs = [];
                          }
                          return needs.length > 0
                            ? needs.map(item => (
                                <span key={item} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                  {item}
                                </span>
                              ))
                            : <span className="text-gray-500">None specified</span>;
                        })()}
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
                        <div key={index} className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border-2 border-orange-200 shadow-lg">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {index + 2}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">{traveler.name}</h4>
                              <p className="text-gray-700 font-medium">Traveler {index + 2}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="block text-sm font-semibold text-gray-700 mb-1">Age</span>
                              <span className="text-gray-900 bg-white px-3 py-1 rounded border">{traveler.age || 'Not specified'}</span>
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
                              {(() => {
                                let restrictions = [];
                                try {
                                  restrictions = typeof traveler.dietary_restrictions === 'string'
                                    ? JSON.parse(traveler.dietary_restrictions || '[]')
                                    : (traveler.dietary_restrictions || []);
                                } catch (e) {
                                  restrictions = [];
                                }
                                return restrictions.length > 0
                                  ? restrictions.map(restriction => (
                                      <span key={restriction} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium border border-orange-200">
                                        🥗 {restriction}
                                      </span>
                                    ))
                                  : <span className="text-gray-500 italic">None specified</span>;
                              })()}
                            </div>
                          </div>

                          {/* Travel Information - Only show if different travel */}
                          {traveler.has_different_travel && (
                            <div className="mb-4">
                              <span className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <span className="text-lg">✈️</span>
                                Travel Information (Different Flight)
                              </span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {traveler.arrival_date && (
                                  <div>
                                    <span className="block text-xs font-medium text-gray-600 mb-1">Arrival Date</span>
                                    <span className="text-gray-900 bg-blue-50 px-3 py-1 rounded border text-sm">{traveler.arrival_date}</span>
                                  </div>
                                )}
                                {traveler.departure_date && (
                                  <div>
                                    <span className="block text-xs font-medium text-gray-600 mb-1">Departure Date</span>
                                    <span className="text-gray-900 bg-blue-50 px-3 py-1 rounded border text-sm">{traveler.departure_date}</span>
                                  </div>
                                )}
                                {traveler.flight_number && (
                                  <div>
                                    <span className="block text-xs font-medium text-gray-600 mb-1">Flight Number</span>
                                    <span className="text-gray-900 bg-blue-50 px-3 py-1 rounded border text-sm">{traveler.flight_number}</span>
                                  </div>
                                )}
                                {traveler.arrival_time && (
                                  <div>
                                    <span className="block text-xs font-medium text-gray-600 mb-1">Arrival Time</span>
                                    <span className="text-gray-900 bg-blue-50 px-3 py-1 rounded border text-sm">{traveler.arrival_time}</span>
                                  </div>
                                )}
                                {traveler.city_of_arrival && (
                                  <div className="md:col-span-2">
                                    <span className="block text-xs font-medium text-gray-600 mb-1">City of Arrival</span>
                                    <span className="text-gray-900 bg-blue-50 px-3 py-1 rounded border text-sm">
                                      {(() => {
                                        const cityMap = {
                                          'CMN': 'Casablanca (CMN)',
                                          'RAK': 'Marrakech (RAK)',
                                          'FEZ': 'Fes (FEZ)',
                                          'TNG': 'Tangier (TNG)',
                                          'RBA': 'Rabat (RBA)',
                                          'AGA': 'Agadir (AGA)',
                                          'ESU': 'Essaouira (ESU)',
                                          'OZZ': 'Ouarzazate (OZZ)',
                                          'NDR': 'Nador (NDR)',
                                          'OUD': 'Oujda (OUD)'
                                        };
                                        return cityMap[traveler.city_of_arrival] || traveler.city_of_arrival;
                                      })()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

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
