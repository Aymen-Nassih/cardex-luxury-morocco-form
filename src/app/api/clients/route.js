import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/database';

export async function GET(request) {
  try {
    const db = getDatabase();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page')) || 1;
    const perPage = parseInt(searchParams.get('per_page')) || 50;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const groupType = searchParams.get('group_type') || '';

    let whereClause = '1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (groupType) {
      whereClause += ' AND group_type = ?';
      params.push(groupType);
    }

    // Get total count
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM clients WHERE ${whereClause}`).get(...params);
    const total = countResult.total;

    // Get paginated results
    const offset = (page - 1) * perPage;
    const clients = db.prepare(`
      SELECT
        id,
        full_name,
        email,
        phone,
        number_of_travelers,
        group_type,
        arrival_date,
        departure_date,
        status,
        created_at
      FROM clients
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, perPage, offset);

    return NextResponse.json({
      success: true,
      clients,
      total_pages: Math.ceil(total / perPage),
      current_page: page,
      total_count: total
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}