import { NextResponse } from 'next/server';
import { getAdminUsers, createAdminUser, deleteAdminUser } from '../../../../lib/supabase-db';

export async function GET() {
  try {
    const users = await getAdminUsers();

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
    const body = await request.json();
    const { email, full_name, role, can_modify, can_delete } = body;

    if (!email || !full_name || !role) {
      return NextResponse.json(
        { success: false, message: 'Email, full name, and role are required' },
        { status: 400 }
      );
    }

    const userData = {
      email,
      full_name,
      role,
      can_modify: can_modify || false,
      can_delete: can_delete || false
    };

    const user = await createAdminUser(userData);

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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    await deleteAdminUser(userId);

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