import { supabase } from './supabase'

export interface FileUploadOptions {
  bucket: string
  folder?: string
  fileName?: string
  isPublic?: boolean
}

export interface StorageFile {
  name: string
  id?: string
  updated_at?: string
  created_at?: string
  last_accessed_at?: string
  metadata?: Record<string, unknown>
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  path: string
  createdAt: Date
}

class FileStorageService {
  private static instance: FileStorageService

  private constructor() {}

  static getInstance(): FileStorageService {
    if (!FileStorageService.instance) {
      FileStorageService.instance = new FileStorageService()
    }
    return FileStorageService.instance
  }

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    file: File,
    options: FileUploadOptions
  ): Promise<{ data: UploadedFile | null; error: string | null }> {
    try {
      // Generate unique filename if not provided
      const fileName = options.fileName || this.generateFileName(file.name)
      const folder = options.folder || 'documents'
      const filePath = `${folder}/${fileName}`

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return { data: null, error: error.message }
      }

      // Get public URL if needed
      let publicUrl = ''
      if (options.isPublic) {
        const { data: urlData } = supabase.storage
          .from(options.bucket)
          .getPublicUrl(filePath)
        publicUrl = urlData.publicUrl
      }

      const uploadedFile: UploadedFile = {
        id: data.id || fileName,
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
        path: filePath,
        createdAt: new Date()
      }

      return { data: uploadedFile, error: null }
    } catch (error) {
      console.error('Unexpected upload error:', error)
      return { data: null, error: 'An unexpected error occurred during upload' }
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: File[],
    options: FileUploadOptions
  ): Promise<{ 
    data: UploadedFile[];
    errors: string[];
    successCount: number;
  }> {
    const uploadedFiles: UploadedFile[] = []
    const errors: string[] = []

    for (const file of files) {
      const { data, error } = await this.uploadFile(file, options)
      if (data) {
        uploadedFiles.push(data)
      } else if (error) {
        errors.push(`${file.name}: ${error}`)
      }
    }

    return {
      data: uploadedFiles,
      errors,
      successCount: uploadedFiles.length
    }
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(
    bucket: string,
    filePath: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Delete error:', error)
      return { success: false, error: 'Failed to delete file' }
    }
  }

  /**
   * Get file URL (signed URL for private files)
   */
  async getFileUrl(
    bucket: string,
    filePath: string,
    expiresIn = 3600
  ): Promise<{ url: string | null; error: string | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn)

      if (error) {
        return { url: null, error: error.message }
      }

      return { url: data.signedUrl, error: null }
    } catch (error) {
      console.error('Get URL error:', error)
      return { url: null, error: 'Failed to get file URL' }
    }
  }

  /**
   * List files in a folder
   */
  async listFiles(
    bucket: string,
    folder?: string,
    limit = 100
  ): Promise<{ data: StorageFile[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder, {
          limit,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('List files error:', error)
      return { data: null, error: 'Failed to list files' }
    }
  }

  /**
   * Create storage bucket
   */
  async createBucket(
    bucketName: string,
    isPublic = false
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Create bucket error:', error)
      return { success: false, error: 'Failed to create bucket' }
    }
  }

  /**
   * Generate unique filename
   */
  private generateFileName(originalName: string): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    const extension = originalName.split('.').pop()
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
    
    return `${nameWithoutExt}_${timestamp}_${random}.${extension}`
  }

  /**
   * Validate file type
   */
  validateFile(
    file: File,
    allowedTypes: string[],
    maxSize: number = 10 * 1024 * 1024 // 10MB default
  ): { valid: boolean; error?: string } {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size ${(maxSize / 1024 / 1024).toFixed(2)}MB`
      }
    }

    return { valid: true }
  }

  /**
   * Get file info
   */
  async getFileInfo(
    bucket: string,
    filePath: string
  ): Promise<{ data: StorageFile | null; error: string | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list('', {
          search: filePath
        })

      if (error) {
        return { data: null, error: error.message }
      }

      const fileInfo = data.find(file => file.name === filePath.split('/').pop())
      return { data: fileInfo || null, error: null }
    } catch (error) {
      console.error('Get file info error:', error)
      return { data: null, error: 'Failed to get file info' }
    }
  }
}

export const fileStorageService = FileStorageService.getInstance()

// Predefined file type constants
export const FILE_TYPES = {
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  IMAGES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ],
  ALL: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
}

// File size constants
export const FILE_SIZES = {
  SMALL: 2 * 1024 * 1024,   // 2MB
  MEDIUM: 10 * 1024 * 1024, // 10MB
  LARGE: 50 * 1024 * 1024   // 50MB
}
