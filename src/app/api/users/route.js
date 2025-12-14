import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/database';

export async function GET() {
  try {
    const db = getDatabase();
    const users = db.prepare(`
      SELECT id, username, full_name, role, can_modify, can_delete, email, created_date, last_login
      FROM users
      ORDER BY created_date DESC
    `).all();

    return NextResponse.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const db = getDatabase();
    const body = await request.json();
    const { email, full_name, role, can_modify, can_delete } = body;

    if (!email || !full_name || !role) {
      return NextResponse.json(
        { success: false, message: 'Email, full name, and role are required' },
        { status: 400 }
      );
    }

    // Generate username from email
    const username = email.split('@')[0];

    const result = db.prepare(`
      INSERT INTO users (username, full_name, role, can_modify, can_delete, email)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(username, full_name, role, can_modify || 0, can_delete || 0, email);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(userId);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}