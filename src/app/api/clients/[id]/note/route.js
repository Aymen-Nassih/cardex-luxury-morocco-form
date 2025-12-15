import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request, { params }) {
  try {
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const clientId = params.id;
    const { note } = await request.json();

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note is required' },
        { status: 400 }
      );
    }

    // Get admin user
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Insert note
    const { error } = await supabase
      .from('client_notes')
      .insert({
        client_id: clientId,
        user_id: adminUser.id,
        note: note
      });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Note added successfully'
    });

  } catch (error) {
    console.error('Add note error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}