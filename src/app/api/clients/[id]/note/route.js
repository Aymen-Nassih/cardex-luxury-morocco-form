import { NextResponse } from 'next/server';
import { addClientNote } from '../../../../lib/supabase-db';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { admin_email, note } = body;

    if (!admin_email || !note) {
      return NextResponse.json(
        { success: false, message: 'Admin email and note are required' },
        { status: 400 }
      );
    }

    const clientNote = await addClientNote(id, admin_email, note);

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