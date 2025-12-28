import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function GET() {
  try {
    // Get clients for manual calculation
    const clients = await db.getClients()
    
    // Calculate stats manually - using actual status values: Pending, Confirmed, Cancelled
    const total_clients = clients.length
    
    // Count by status
    const by_status = {
      Pending: clients.filter(client => client.status === 'Pending').length,
      Confirmed: clients.filter(client => client.status === 'Confirmed').length,
      Cancelled: clients.filter(client => client.status === 'Cancelled').length
    }

    // Calculate total group size (sum of all travelers)
    const total_group_size = clients.reduce((sum, client) => {
      return sum + (parseInt(client.number_of_travelers) || 1)
    }, 0)

    // Group by month
    const monthlyStats = {}
    clients.forEach(client => {
      const month = new Date(client.created_at).toISOString().slice(0, 7) // YYYY-MM
      if (!monthlyStats[month]) {
        monthlyStats[month] = { month, count: 0, confirmed: 0 }
      }
      monthlyStats[month].count++
      if (client.status === 'Confirmed') {
        monthlyStats[month].confirmed++
      }
    })

    // Get group type distribution
    const groupTypeStats = {}
    clients.forEach(client => {
      const groupType = client.group_type || 'Unknown'
      if (!groupTypeStats[groupType]) {
        groupTypeStats[groupType] = 0
      }
      groupTypeStats[groupType]++
    })

    const stats = {
      total_clients,
      by_status,
      total_group_size,
      monthlyStats: Object.values(monthlyStats),
      groupTypeStats
    }

    return NextResponse.json({
      success: true,
      stats: stats
    })
  } catch (error) {
    console.error('❌ GET stats error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}