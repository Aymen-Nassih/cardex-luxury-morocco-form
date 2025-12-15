import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET() {
  try {
    const db = getDatabase();

    // Total clients
    const totalClientsResult = db.prepare('SELECT COUNT(*) as count FROM clients').get();
    const totalClients = totalClientsResult.count;

    // By status
    const statusResults = db.prepare('SELECT status, COUNT(*) as count FROM clients GROUP BY status').all();
    const byStatus = {};
    statusResults.forEach(row => {
      byStatus[row.status] = row.count;
    });

    // By group type
    const groupResults = db.prepare('SELECT group_type, COUNT(*) as count FROM clients WHERE group_type IS NOT NULL GROUP BY group_type').all();
    const byGroupType = {};
    groupResults.forEach(row => {
      byGroupType[row.group_type] = row.count;
    });

    // Upcoming arrivals (next 30 days)
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const upcomingResult = db.prepare(`
      SELECT COUNT(*) as count FROM clients
      WHERE arrival_date >= ? AND arrival_date <= ?
    `).get(today, thirtyDaysLater);
    const upcomingArrivals = upcomingResult.count;

    return NextResponse.json({
      success: true,
      stats: {
        total_clients: totalClients,
        by_status: byStatus,
        by_group_type: byGroupType,
        upcoming_arrivals: upcomingArrivals
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}