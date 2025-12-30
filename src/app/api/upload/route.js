import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    console.log('📁 Upload API called');
    const formData = await request.formData()
    console.log('FormData keys:', Array.from(formData.keys()));

    const file = formData.get('file')
    const fileType = formData.get('fileType') // 'client' or 'traveler'
    const clientId = formData.get('clientId')
    const travelerId = formData.get('travelerId') // optional, for travelers

    console.log('File received:', file ? 'Yes' : 'No');
    console.log('File type param:', fileType);
    console.log('Client ID:', clientId);
    console.log('Traveler ID:', travelerId);

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 })
    }

    if (!clientId) {
      return NextResponse.json({
        success: false,
        error: 'Client ID is required'
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    console.log('File type received:', file.type, 'File name:', file.name)

    // More permissive check for common image types
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({
        success: false,
        error: `Invalid file type: ${file.type}. Only JPEG, PNG, and PDF files are allowed.`
      }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File size too large. Maximum size is 10MB.'
      }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${fileType}_${clientId}${travelerId ? `_${travelerId}` : ''}_${Date.now()}.${fileExt}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('passport-documents')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({
        success: false,
        error: 'Failed to upload file'
      }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('passport-documents')
      .getPublicUrl(fileName)

    const fileUrl = urlData.publicUrl

    // Update database with file URL
    let updateData = {
      passport_filename: file.name,
      passport_file_url: fileUrl,
      passport_uploaded_at: new Date().toISOString()
    }

    let updateResult
    if (fileType === 'traveler' && travelerId) {
      // Update traveler record
      updateResult = await supabase
        .from('additional_travelers')
        .update(updateData)
        .eq('id', travelerId)
        .select()
        .single()
    } else {
      // Update client record
      updateResult = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', clientId)
        .select()
        .single()
    }

    if (updateResult.error) {
      console.error('Database update error:', updateResult.error)
      // Try to delete the uploaded file since DB update failed
      await supabase.storage
        .from('passport-documents')
        .remove([fileName])

      return NextResponse.json({
        success: false,
        error: 'Failed to update database'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      fileUrl: fileUrl,
      fileName: file.name,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}