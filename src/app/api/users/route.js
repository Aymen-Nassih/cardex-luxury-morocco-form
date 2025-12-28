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

export async function GET(request) {
  try {
    // Verify admin access
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const users = await db.getAllUsers()

    return NextResponse.json({
      success: true,
      users: users
    })
  } catch (error) {
    console.error('❌ GET users error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Verify admin access
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const { username, email, password, full_name, role, can_modify, can_delete } = await request.json()

    // Validate required fields
    if (!username || !email || !password || !full_name) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Hash password
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Create user
    const userData = {
      username,
      email,
      full_name,
      password_hash,
      role: role || 'User',
      can_modify: can_modify || false,
      can_delete: can_delete || false
    }

    const user = await db.createUser(userData)

    // Return user without password hash
    const { password_hash: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('❌ POST users error:', error)

    // Handle duplicate key errors
    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: 'Username or email already exists'
      }, { status: 409 })
    }

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}