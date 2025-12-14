import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../../../lib/database';

export async function POST(request, { params }) {
  try {
    const db = getDatabase();
    const { id } = params;
    const body = await request.json();
    const { admin_email, note } = body;

    if (!admin_email || !note) {
      return NextResponse.json(
        { success: false, message: 'Admin email and note are required' },
        { status: 400 }
      );
    }

    // Get user ID from email
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(admin_email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Admin user not found' },
        { status: 404 }
      );
    }

    const result = db.prepare(`
      INSERT INTO client_notes (client_id, user_id, note)
      VALUES (?, ?, ?)
    `).run(id, user.id, note);

    const clientNote = db.prepare(`
      SELECT * FROM client_notes WHERE id = ?
    `).get(result.lastInsertRowid);

    return NextResponse.json({
      success: true,
      note: clientNote
    });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add note' },
      { status: 500 }
    );
  }
}