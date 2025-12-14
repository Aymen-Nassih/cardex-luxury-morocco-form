import { NextResponse } from 'next/server';
import { getClientById, updateClient, logModification } from '../../../../lib/supabase-db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await getClientById(id);

    return NextResponse.json({
      success: true,
      client: result.client,
      notes: result.notes,
      history: result.history
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
    const { id } = params;
    const body = await request.json();
    const { admin_email, ...updates } = body;

    // Get current client data for logging
    const currentData = await getClientById(id);
    const oldStatus = currentData.client.status;

    // Update client
    const updatedClient = await updateClient(id, updates);

    // Log the modification if status changed
    if (admin_email && updates.status && updates.status !== oldStatus) {
      await logModification(id, admin_email, 'Status Change', oldStatus, updates.status);
    }

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