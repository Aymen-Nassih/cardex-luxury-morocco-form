import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Supabase Config Check:')
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database helper functions
export const db = {
  // Clients
  async createClient(clientData) {
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getClientById(id) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async updateClient(id, updates) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Additional Travelers
  async addTraveler(travelerData) {
    const { data, error } = await supabase
      .from('additional_travelers')
      .insert(travelerData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getTravelersByClientId(clientId) {
    const { data, error } = await supabase
      .from('additional_travelers')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async updateTraveler(id, updates) {
    const { data, error } = await supabase
      .from('additional_travelers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteTraveler(id) {
    const { error } = await supabase
      .from('additional_travelers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Notes
  async addNote(noteData) {
    const { data, error } = await supabase
      .from('client_notes')
      .insert(noteData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getNotesByClientId(clientId) {
    const { data, error } = await supabase
      .from('client_notes')
      .select('*')
      .eq('client_id', clientId)
      .order('created_date', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Stats
  async getStats() {
    const { data, error } = await supabase
      .rpc('get_client_stats')
    
    if (error) throw error
    return data
  },

  // Authentication helpers
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // User management functions
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getUserByUsername(username) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error) throw error
    return data
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw error
    return data
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteUser(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  async updateLastLogin(id) {
    const { data, error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}