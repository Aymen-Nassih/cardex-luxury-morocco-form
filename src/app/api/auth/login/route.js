import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Username and password are required'
      }, { status: 400 })
    }

    // Find user by username
    const user = await db.getUserByUsername(username)
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid username or password'
      }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid username or password'
      }, { status: 401 })
    }

    // Update last login
    await db.updateLastLogin(user.id)

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Return user data and token (exclude password hash)
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token: token,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}