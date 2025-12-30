'use client';

import { useState, useRef } from 'react';

export default function FileUpload({ 
  label = "Upload File", 
  accept = "image/*,.pdf", 
  maxSize = 10 * 1024 * 1024, // 10MB default
  onFileSelect,
  currentFile,
  disabled = false
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return false;
    }

    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const mimeType = file.type;

    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type.toLowerCase();
      } else if (type.includes('/*')) {
        return mimeType.startsWith(type.split('/')[0]);
      } else {
        return mimeType === type;
      }
    });

    if (!isValidType) {
      setError(`File type not allowed. Accepted types: ${accept}`);
      return false;
    }

    return true;
  };

  const handleFile = async (file) => {
    if (!validateFile(file)) return;

    setError('');
    setUploading(true);

    try {
      // For now, we'll just simulate the upload and pass the file info
      // In a real implementation, you would upload to Supabase Storage here
      const fileData = {
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };

      onFileSelect?.(fileData);
    } catch (err) {
      setError('Failed to process file');
      console.error('File upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || uploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (disabled || uploading) return;

    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    onFileSelect?.(null);
    setError('');
  };

  return (
    <div className="w-full">
      <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
        {label}
      </label>
      
      {/* Current file display */}
      {currentFile && (
        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-600">📄</span>
              <div>
                <p className="text-sm font-medium text-green-800">{currentFile.name}</p>
                <p className="text-xs text-green-600">
                  {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
              disabled={disabled || uploading}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Upload area */}
      {!currentFile && (
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
            transition-all duration-200 hover:border-[#B5541B] hover:bg-orange-50
            ${dragActive ? 'border-[#B5541B] bg-orange-50' : 'border-gray-300'}
            ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
            disabled={disabled || uploading}
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-[#B5541B] rounded-full flex items-center justify-center">
              {uploading ? (
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                <span className="text-white text-xl">📷</span>
              )}
            </div>
            
            <div>
              <p className="text-gray-900 font-semibold text-sm">
                {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                {accept} • Max {Math.round(maxSize / (1024 * 1024))}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}

      {/* Helper text */}
      <p className="text-gray-500 text-xs mt-2">
        Please upload a clear photo or scan of your passport. Make sure all text is readable.
      </p>
    </div>
  );
}