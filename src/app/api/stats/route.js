import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/database.js';

export async function GET() {
  try {
    const db = getDatabase();

    // Get total clients count
    const totalClients = db.prepare('SELECT COUNT(*) as count FROM clients').get().count;

    // Get clients by status
    const statusStats = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM clients
      GROUP BY status
    `).all();

    // Get clients by group type
    const groupStats = db.prepare(`
      SELECT group_type, COUNT(*) as count
      FROM clients
      GROUP BY group_type
    `).all();

    // Get recent submissions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSubmissions = db.prepare(`
      SELECT COUNT(*) as count
      FROM clients
      WHERE created_at >= ?
    `).get(thirtyDaysAgo.toISOString()).count;

    // Get total additional travelers
    const totalTravelers = db.prepare('SELECT COUNT(*) as count FROM additional_travelers').get().count;

    return NextResponse.json({
      total_clients: totalClients,
      status_breakdown: statusStats,
      group_type_breakdown: groupStats,
      recent_submissions: recentSubmissions,
      total_travelers: totalTravelers,
      total_group_size: totalClients + totalTravelers
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({
      error: 'Failed to fetch stats'
    }, { status: 500 });
  }
}