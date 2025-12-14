import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../../../lib/database';

export async function GET(request, { params }) {
  try {
    const db = getDatabase();
    const { id } = params;

    // Get client details
    const client = db.prepare(`
      SELECT * FROM clients WHERE id = ?
    `).get(id);

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    client.dietary_restrictions = JSON.parse(client.dietary_restrictions || '[]');
    client.accessibility_needs = JSON.parse(client.accessibility_needs || '[]');

    // Get client notes
    const notes = db.prepare(`
      SELECT * FROM client_notes
      WHERE client_id = ?
      ORDER BY created_date DESC
    `).all(id);

    // Get modification history
    const history = db.prepare(`
      SELECT * FROM modification_log
      WHERE client_id = ?
      ORDER BY modified_date DESC
    `).all(id);

    return NextResponse.json({
      success: true,
      client,
      notes,
      history
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { success: false, message: 'Client not found' },
      { status: 404 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const db = getDatabase();
    const { id } = params;
    const body = await request.json();
    const { admin_email, ...updates } = body;

    // Get current client data for logging
    const currentData = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
    if (!currentData) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    const oldStatus = currentData.status;

    // Update client
    const updateFields = [];
    const updateValues = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      }
    });

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    db.prepare(`
      UPDATE clients
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `).run(...updateValues);

    // Log the modification if status changed
    if (admin_email && updates.status && updates.status !== oldStatus) {
      db.prepare(`
        INSERT INTO modification_log (client_id, user_id, action, old_values, new_values)
        VALUES (?, (SELECT id FROM users WHERE email = ?), ?, ?, ?)
      `).run(id, admin_email, 'Status Change', JSON.stringify({ status: oldStatus }), JSON.stringify({ status: updates.status }));
    }

    // Get updated client
    const updatedClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
    updatedClient.dietary_restrictions = JSON.parse(updatedClient.dietary_restrictions || '[]');
    updatedClient.accessibility_needs = JSON.parse(updatedClient.accessibility_needs || '[]');

    return NextResponse.json({
      success: true,
      client: updatedClient
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update client' },
      { status: 500 }
    );
  }
}