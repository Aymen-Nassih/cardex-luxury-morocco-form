import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/database.js';

export async function POST(request) {
  try {
    const db = getDatabase();
    const { username, password } = await request.json();

    // Simple authentication - in production, use proper hashing
    const user = db.prepare(`
      SELECT id, username, role FROM users
      WHERE username = ? AND password = ?
    `).get(username, password);

    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({
      error: 'Authentication failed'
    }, { status: 500 });
  }
}