"use client"

import { useState, useRef } from 'react'
import { useAssets } from '@/hooks/use-assets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

export function AssetUploader() {
  const { uploadAsset, refreshAssets, error } = useAssets()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [assetName, setAssetName] = useState('')
  const [assetType, setAssetType] = useState<'logo' | 'video' | 'image'>('logo')
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadResult(null)
      
      // Auto-generate name from filename
      const nameWithoutExt = file.name.split('.').slice(0, -1).join('.')
      setAssetName(nameWithoutExt)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !assetName.trim()) {
      setUploadResult({ success: false, message: 'Please select a file and enter a name' })
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadResult(null)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const result = await uploadAsset(selectedFile, assetName.trim(), assetType)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        setUploadResult({ 
          success: true, 
          message: `Asset uploaded successfully! URL: ${result.url}` 
        })
        setSelectedFile(null)
        setAssetName('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        refreshAssets()
      } else {
        setUploadResult({ 
          success: false, 
          message: result.error || 'Upload failed' 
        })
      }
    } catch (err) {
      setUploadResult({ 
        success: false, 
        message: 'Upload failed unexpectedly' 
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setAssetName('')
    setUploadResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getFileTypeDescription = (type: string) => {
    switch (type) {
      case 'logo':
        return 'SVG, PNG, or JPEG files (recommended: SVG for logos)'
      case 'video':
        return 'MP4 or WebM files (max 10MB)'
      case 'image':
        return 'PNG or JPEG files'
      default:
        return ''
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Asset
        </CardTitle>
        <CardDescription>
          Upload logo, video, or image files to Supabase storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Selection */}
        <div className="space-y-2">
          <Label htmlFor="file">Select File</Label>
          <Input
            id="file"
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={
              assetType === 'logo' ? '.svg,.png,.jpg,.jpeg' :
              assetType === 'video' ? '.mp4,.webm' :
              '.png,.jpg,.jpeg'
            }
            disabled={uploading}
          />
          {selectedFile && (
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-sm truncate">{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Asset Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="type">Asset Type</Label>
          <Select value={assetType} onValueChange={(value: 'logo' | 'video' | 'image') => setAssetType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="logo">Logo</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="image">Image</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            {getFileTypeDescription(assetType)}
          </p>
        </div>

        {/* Asset Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Asset Name</Label>
          <Input
            id="name"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            placeholder="Enter asset name"
            disabled={uploading}
          />
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !assetName.trim() || uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Upload Asset'}
        </Button>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <Alert variant={uploadResult.success ? "default" : "destructive"}>
            {uploadResult.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{uploadResult.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
