import { supabase } from './supabase';

// Database helper functions using Supabase
export async function getClients(page = 1, perPage = 50, search = '', status = '', groupType = '') {
  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Apply filters
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  }
  if (status) {
    query = query.eq('status', status);
  }
  if (groupType) {
    query = query.eq('group_type', groupType);
  }

  // Apply pagination
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    clients: data || [],
    total_count: count || 0,
    total_pages: Math.ceil((count || 0) / perPage),
    current_page: page
  };
}

export async function getClientById(id) {
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (clientError) throw clientError;

  const { data: notes, error: notesError } = await supabase
    .from('client_notes')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false });

  if (notesError) throw notesError;

  const { data: history, error: historyError } = await supabase
    .from('modification_log')
    .select('*')
    .eq('client_id', id)
    .order('modified_at', { ascending: false });

  if (historyError) throw historyError;

  return {
    client,
    notes: notes || [],
    history: history || []
  };
}

export async function getClientTravelers(clientId) {
  const { data, error } = await supabase
    .from('additional_travelers')
    .select('*')
    .eq('client_id', clientId)
    .order('traveler_number', { ascending: true });

  if (error) throw error;

  // Parse JSON strings back to arrays
  const travelers = (data || []).map(traveler => {
    let dietary_restrictions = [];
    try {
      dietary_restrictions = traveler.dietary_restrictions ? JSON.parse(traveler.dietary_restrictions) : [];
    } catch (e) {
      console.warn('Failed to parse traveler dietary_restrictions:', e);
      dietary_restrictions = [];
    }
    return {
      ...traveler,
      dietary_restrictions
    };
  });

  return travelers;
}

export async function createClient(clientData) {
  const { data, error } = await supabase
    .from('clients')
    .insert(clientData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createTravelers(clientId, travelers) {
  const travelersData = travelers.map((traveler, index) => ({
    client_id: clientId,
    traveler_number: index + 1,
    name: traveler.name,
    email: traveler.email || null,
    phone: traveler.phone || null,
    age_group: traveler.age_group || null,
    relationship: traveler.relationship || null,
    dietary_restrictions: JSON.stringify(traveler.dietary_restrictions || []),
    special_notes: traveler.special_notes || null
  }));

  const { data, error } = await supabase
    .from('additional_travelers')
    .insert(travelersData);

  if (error) throw error;
  return data;
}

export async function updateClient(id, updates) {
  const { data, error } = await supabase
    .from('clients')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addClientNote(clientId, adminEmail, note) {
  const { data, error } = await supabase
    .from('client_notes')
    .insert({
      client_id: clientId,
      admin_email: adminEmail,
      note
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function logModification(clientId, adminEmail, action, oldValue, newValue) {
  const { data, error } = await supabase
    .from('modification_log')
    .insert({
      client_id: clientId,
      admin_email: adminEmail,
      action,
      old_value: oldValue,
      new_value: newValue
    });

  if (error) throw error;
  return data;
}

export async function getStats() {
  // Get total clients
  const { count: totalClients, error: clientsError } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });

  if (clientsError) throw clientsError;

  // Get status breakdown
  const { data: statusData, error: statusError } = await supabase
    .from('clients')
    .select('status');

  if (statusError) throw statusError;

  const statusBreakdown = statusData.reduce((acc, client) => {
    acc[client.status] = (acc[client.status] || 0) + 1;
    return acc;
  }, {});

  // Get total travelers (main clients + additional travelers)
  const { count: additionalTravelers, error: travelersError } = await supabase
    .from('additional_travelers')
    .select('*', { count: 'exact', head: true });

  if (travelersError) throw travelersError;

  const totalGroupSize = (totalClients || 0) + (additionalTravelers || 0);

  return {
    total_clients: totalClients || 0,
    total_group_size: totalGroupSize,
    status_breakdown: Object.entries(statusBreakdown).map(([status, count]) => ({
      status,
      count
    }))
  };
}

export async function getAdminUsers() {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAdminUser(userData) {
  const { data, error } = await supabase
    .from('admin_users')
    .insert(userData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAdminUser(userId) {
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', userId);

  if (error) throw error;
  return true;
}