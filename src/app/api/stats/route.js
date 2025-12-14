import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/database';

export async function GET() {
  try {
    const db = getDatabase();

    // Get total clients
    const totalClients = db.prepare('SELECT COUNT(*) as count FROM clients').get().count;

    // Get status breakdown
    const statusData = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM clients
      GROUP BY status
    `).all();

    // Get total travelers (main clients + additional travelers)
    const additionalTravelers = db.prepare('SELECT COUNT(*) as count FROM additional_travelers').get().count;
    const totalGroupSize = totalClients + additionalTravelers;

    const stats = {
      total_clients: totalClients,
      total_group_size: totalGroupSize,
      status_breakdown: statusData.map(item => ({
        status: item.status,
        count: item.count
      }))
    };

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}