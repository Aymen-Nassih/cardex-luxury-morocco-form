import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to verify admin token
async function verifyAdmin(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET)

    // Get user from database
    const user = await db.getUserById(decoded.id)
    if (!user || user.role !== 'Admin') {
      return null
    }

    return user
  } catch (error) {
    return null
  }
}

export async function GET(request, { params }) {
  try {
    // Verify admin access
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const { id } = await params
    const user = await db.getUserById(id)

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('❌ GET user error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    // Verify admin access
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const { id } = await params
    const updates = await request.json()

    // Don't allow updating password through this endpoint for security
    // Password updates should be handled separately
    delete updates.password
    delete updates.password_hash

    const user = await db.updateUser(id, updates)

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'User updated successfully'
    })
  } catch (error) {
    console.error('❌ PUT user error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // Verify admin access
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const { id } = await params

    // Prevent deleting the current admin user
    if (parseInt(id) === admin.id) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete your own account'
      }, { status: 400 })
    }

    const success = await db.deleteUser(id)

    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'User not found or could not be deleted'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('❌ DELETE user error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}