import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function GET(request, { params }) {
  try {
    const { id: clientId } = await params
    const travelers = await db.getTravelersByClientId(clientId)
    
    return NextResponse.json({
      success: true,
      travelers: travelers
    })
  } catch (error) {
    console.error('❌ GET travelers error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const { id: clientId } = await params
    const travelerData = await request.json()
    
    const newTraveler = await db.addTraveler({
      ...travelerData,
      client_id: clientId
    })
    
    return NextResponse.json({
      success: true,
      traveler: newTraveler
    })
  } catch (error) {
    console.error('❌ POST traveler error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}