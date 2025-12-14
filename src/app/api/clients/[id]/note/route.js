import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/database.js';

export async function POST(request, { params }) {
  try {
    const db = getDatabase();
    const clientId = params.id;
    const { note, created_by } = await request.json();

    const result = db.prepare(`
      INSERT INTO client_notes (client_id, note, created_by, created_at)
      VALUES (?, ?, ?, ?)
    `).run(
      clientId,
      note,
      created_by || 'system',
      new Date().toISOString()
    );

    return NextResponse.json({
      success: true,
      note_id: result.lastInsertRowid,
      message: 'Note added successfully'
    });

  } catch (error) {
    console.error('Note creation error:', error);
    return NextResponse.json({
      error: 'Failed to add note'
    }, { status: 500 });
  }
}