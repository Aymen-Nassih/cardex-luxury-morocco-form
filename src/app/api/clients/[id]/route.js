import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const client = await db.getClientById(id)
    
    if (!client) {
      return NextResponse.json({
        success: false,
        error: 'Client not found'
      }, { status: 404 })
    }

    // Get additional travelers for this client
    const travelers = await db.getTravelersByClientId(id)
    
    // Get notes for this client
    const notes = await db.getNotesByClientId(id)

    return NextResponse.json({
      success: true,
      client: {
        ...client,
        travelers: travelers,
        notes: notes
      }
    })
  } catch (error) {
    console.error('❌ GET client error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const updates = await request.json()
    
    const client = await db.updateClient(id, updates)
    
    return NextResponse.json({
      success: true,
      client: client
    })
  } catch (error) {
    console.error('❌ PUT client error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    
    // Note: In a real application, you might want to soft delete
    // or handle this differently to maintain data integrity
    
    // For now, we'll just return a success message
    // as Supabase doesn't support direct deletion in our setup
    
    return NextResponse.json({
      success: true,
      message: 'Client deletion requested (implement soft delete in production)'
    })
  } catch (error) {
    console.error('❌ DELETE client error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}