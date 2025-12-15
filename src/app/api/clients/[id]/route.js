import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(request, { params }) {
  try {
    const db = getDatabase();
    const { id: clientId } = await params;

    // Get client
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(clientId);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    client.dietary_restrictions = JSON.parse(client.dietary_restrictions || '[]');
    client.accessibility_needs = JSON.parse(client.accessibility_needs || '[]');

    // Get notes
    const notes = db.prepare(`
      SELECT * FROM client_notes
      WHERE client_id = ?
      ORDER BY created_date DESC
    `).all(clientId);

    // Get modification history
    const history = db.prepare(`
      SELECT * FROM modification_log
      WHERE client_id = ?
      ORDER BY modified_date DESC
      LIMIT 20
    `).all(clientId);

    return NextResponse.json({
      success: true,
      client,
      notes,
      history
    });

  } catch (error) {
    console.error('Get client error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const db = getDatabase();
    const { id: clientId } = await params;
    const updates = await request.json();

    // Get old values for logging
    const oldClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(clientId);

    if (!oldClient) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'id') {
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      }
    });

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(clientId);

    // Update client
    db.prepare(`
      UPDATE clients
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `).run(...updateValues);

    // Log the modification (using admin user ID 1 for now)
    db.prepare(`
      INSERT INTO modification_log (client_id, user_id, action, old_values, new_values)
      VALUES (?, ?, ?, ?, ?)
    `).run(clientId, 1, 'Updated', JSON.stringify(oldClient), JSON.stringify(updates));

    return NextResponse.json({
      success: true,
      message: 'Client updated successfully'
    });

  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}