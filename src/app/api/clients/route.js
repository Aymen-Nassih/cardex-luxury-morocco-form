import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const perPage = parseInt(searchParams.get('per_page')) || 50
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const groupType = searchParams.get('group_type') || ''

    // Get all clients first
    const allClients = await db.getClients()

    // Apply filters
    let filteredClients = allClients

    // Search filter (name, email, phone)
    if (search) {
      const searchLower = search.toLowerCase()
      filteredClients = filteredClients.filter(client =>
        client.full_name?.toLowerCase().includes(searchLower) ||
        client.email?.toLowerCase().includes(searchLower) ||
        client.phone?.toLowerCase().includes(searchLower)
      )
    }

    // Status filter
    if (status) {
      filteredClients = filteredClients.filter(client => client.status === status)
    }

    // Group type filter
    if (groupType) {
      filteredClients = filteredClients.filter(client => client.group_type === groupType)
    }

    // Pagination
    const totalClients = filteredClients.length
    const totalPages = Math.ceil(totalClients / perPage)
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedClients = filteredClients.slice(startIndex, endIndex)

    // Get additional travelers for each client
    const clientsWithTravelers = await Promise.all(
      paginatedClients.map(async (client) => {
        const travelers = await db.getTravelersByClientId(client.id)
        return {
          ...client,
          additional_travelers: travelers,
          // Format full_name for compatibility
          full_name: client.full_name,
          number_of_travelers: client.number_of_travelers,
          group_type: client.group_type,
          arrival_date: client.arrival_date,
          created_at: client.created_at
        }
      })
    )

    return NextResponse.json({
      success: true,
      clients: clientsWithTravelers,
      total_pages: totalPages,
      current_page: page,
      total_clients: totalClients
    })
  } catch (error) {
    console.error('❌ GET clients error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const clientData = await request.json()
    const client = await db.createClient(clientData)
    
    return NextResponse.json({
      success: true,
      client: client
    })
  } catch (error) {
    console.error('❌ POST client error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}