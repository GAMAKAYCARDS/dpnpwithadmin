'use client'

import { useState } from 'react'
import { useHeroImages, HeroImage } from '@/hooks/use-hero-images'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Upload, Trash2, Edit, Save, X, FileImage } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function HeroImageManager() {
  const { 
    heroImages, 
    loading, 
    error, 
    uploadHeroImage, 
    deleteHeroImage, 
    updateHeroImage,
    refreshHeroImages 
  } = useHeroImages()

  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<HeroImage>>({})
  const [uploadForm, setUploadForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    button_link: '',
    show_content: true
  })
  const [previewMode, setPreviewMode] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('🎯 Starting file upload process...')
    setUploading(true)
    try {
      const success = await uploadHeroImage(file, {
        title: uploadForm.title,
        subtitle: uploadForm.subtitle,
        description: uploadForm.description,
        button_text: '',
        button_link: uploadForm.button_link,
        display_order: heroImages.length + 1,
        show_content: uploadForm.show_content
      })

      if (success) {
        console.log('✅ Upload completed successfully')
        event.target.value = '' // Clear the input
        setUploadForm({ title: '', subtitle: '', description: '', button_link: '', show_content: true }) // Clear form
      } else {
        console.log('❌ Upload failed')
      }
    } catch (error) {
      console.error('❌ Upload error in component:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageId: number | string) => {
    if (confirm('Are you sure you want to delete this hero image?')) {
      await deleteHeroImage(imageId)
    }
  }

  const startEditing = (image: HeroImage) => {
    setEditingId(image.id)
    setEditForm({
      title: image.title,
      subtitle: image.subtitle,
      description: image.description,
      button_text: image.button_text,
      button_link: image.button_link,
      display_order: image.display_order,
      is_active: image.is_active,
      show_content: image.show_content !== false
    })
  }

  const saveEdit = async () => {
    if (editingId) {
      await updateHeroImage(editingId, editForm)
      setEditingId(null)
      setEditForm({})
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const toggleActive = async (image: HeroImage) => {
    await updateHeroImage(image.id, { is_active: !image.is_active })
  }

  if (loading) {
    return (
      <Card className="bg-black/50 border-[#F7DD0F]/20">
        <CardHeader>
          <CardTitle className="text-white">Hero Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F7DD0F]"></div>
            <span className="ml-2 text-white">Loading hero images...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/50 border-[#F7DD0F]/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <FileImage className="w-5 h-5 text-[#F7DD0F]" />
            Hero Carousel Management
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setPreviewMode(!previewMode)} 
              variant="outline" 
              size="sm"
              className="border-[#F7DD0F]/30 text-[#F7DD0F] hover:bg-[#F7DD0F]/10"
            >
              {previewMode ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button 
              onClick={refreshHeroImages} 
              variant="outline" 
              size="sm"
              className="border-[#F7DD0F]/30 text-[#F7DD0F] hover:bg-[#F7DD0F]/10"
            >
              Refresh
            </Button>
          </div>
        </CardTitle>
        <p className="text-gray-300 text-sm">
          Manage hero images for the sliding card carousel. Active images will be displayed on the homepage.
        </p>
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : error ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <span className="text-gray-400">
            {loading ? 'Loading...' : error ? 'Connection Error' : `${heroImages.length} images loaded`}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-500/30 text-red-300">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Preview Section */}
        {previewMode && (
          <div className="border border-[#F7DD0F]/20 rounded-lg p-4 bg-black/30">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <FileImage className="w-4 h-4 text-[#F7DD0F]" />
              Carousel Preview
            </h3>
            {heroImages.filter(img => img.is_active).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileImage className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No active hero images to preview</p>
                <p className="text-sm">Upload and activate images to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {heroImages
                  .filter(img => img.is_active)
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((image, index) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-video bg-black/50 rounded-lg overflow-hidden border border-[#F7DD0F]/20">
                        <img
                          src={image.image_url}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h4 className="text-white font-semibold text-sm">{image.title}</h4>
                          {image.subtitle && (
                            <p className="text-gray-300 text-xs">{image.subtitle}</p>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 bg-[#F7DD0F] text-black text-xs px-2 py-1 rounded font-bold">
                        {index + 1}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Upload Section */}
        <div className="border-2 border-dashed border-[#F7DD0F]/30 rounded-lg p-6 bg-black/20">
          <div className="text-center mb-6">
            <Upload className="mx-auto h-12 w-12 text-[#F7DD0F] mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Upload Hero Image
            </h3>
            <p className="text-gray-300 mb-4">
              Upload an image to display in the hero carousel. Recommended size: 1920x1080px
            </p>
          </div>
          
          {/* Text Input Fields */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="upload-title" className="text-white">Title *</Label>
                <Input
                  id="upload-title"
                  placeholder="Enter hero title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  disabled={uploading}
                  className="bg-black/50 border-[#F7DD0F]/30 text-white placeholder-gray-400 focus:ring-[#F7DD0F] focus:border-[#F7DD0F]"
                />
              </div>
              <div>
                <Label htmlFor="upload-subtitle" className="text-white">Subtitle</Label>
                <Input
                  id="upload-subtitle"
                  placeholder="Enter subtitle"
                  value={uploadForm.subtitle}
                  onChange={(e) => setUploadForm({ ...uploadForm, subtitle: e.target.value })}
                  disabled={uploading}
                  className="bg-black/50 border-[#F7DD0F]/30 text-white placeholder-gray-400 focus:ring-[#F7DD0F] focus:border-[#F7DD0F]"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="upload-description" className="text-white">Description</Label>
              <Textarea
                id="upload-description"
                placeholder="Enter description (optional)"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                rows={3}
                disabled={uploading}
                className="bg-black/50 border-[#F7DD0F]/30 text-white placeholder-gray-400 focus:ring-[#F7DD0F] focus:border-[#F7DD0F]"
              />
            </div>
            <div>
              <Label htmlFor="upload-link" className="text-white">Link URL</Label>
              <Input
                id="upload-link"
                placeholder="Enter link URL (e.g., /product/123 or https://example.com)"
                value={uploadForm.button_link}
                onChange={(e) => setUploadForm({ ...uploadForm, button_link: e.target.value })}
                disabled={uploading}
                className="bg-black/50 border-[#F7DD0F]/30 text-white placeholder-gray-400 focus:ring-[#F7DD0F] focus:border-[#F7DD0F]"
              />
              <p className="text-xs text-gray-400 mt-1">
                When users click on this carousel slide, they will be redirected to this URL
              </p>
            </div>
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-[#F7DD0F]/20">
              <div>
                <Label className="text-white font-medium">Show Content</Label>
                <p className="text-xs text-gray-400 mt-1">
                  Display title, subtitle, and description on this carousel slide
                </p>
              </div>
              <Switch
                checked={uploadForm.show_content}
                onCheckedChange={(checked) => setUploadForm({ ...uploadForm, show_content: checked })}
                disabled={uploading}
                className="data-[state=checked]:bg-[#F7DD0F] data-[state=unchecked]:bg-gray-600"
              />
            </div>
          </div>
          
          {/* File Upload */}
          <div className="text-center">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="max-w-xs mx-auto bg-black/50 border-[#F7DD0F]/30 text-white file:bg-[#F7DD0F] file:text-black file:border-0 file:rounded file:px-4 file:py-2 file:cursor-pointer hover:file:bg-[#F7DD0F]/90"
            />
            {uploading && (
              <div className="flex items-center justify-center gap-2 mt-2 text-[#F7DD0F]">
                <div className="w-4 h-4 border-2 border-[#F7DD0F] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm">Uploading...</p>
              </div>
            )}
          </div>
        </div>

        {/* Hero Images List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <FileImage className="w-5 h-5 text-[#F7DD0F]" />
            Current Hero Images ({heroImages.filter(img => img.is_active).length} active)
          </h3>
          {heroImages.length === 0 ? (
            <div className="text-center py-8 text-gray-400 border border-[#F7DD0F]/20 rounded-lg bg-black/20">
              <FileImage className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hero images uploaded yet.</p>
              <p className="text-sm">Upload your first hero image to get started</p>
            </div>
          ) : (
            heroImages.map((image) => (
              <Card key={image.id} className="overflow-hidden bg-black/30 border-[#F7DD0F]/20">
                <div className="flex">
                  {/* Image Preview */}
                  <div className="w-48 h-32 relative bg-black/50">
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Switch
                        checked={image.is_active}
                        onCheckedChange={() => toggleActive(image)}
                        className="data-[state=checked]:bg-[#F7DD0F] data-[state=unchecked]:bg-gray-600"
                      />
                    </div>
                    <div className="absolute bottom-2 left-2 bg-[#F7DD0F] text-black text-xs px-2 py-1 rounded font-bold">
                      Order: {image.display_order}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 text-white">
                    {editingId === image.id ? (
                      // Edit Form
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="title" className="text-white">Title</Label>
                            <Input
                              id="title"
                              value={editForm.title || ''}
                              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                              className="bg-black/50 border-[#F7DD0F]/30 text-white placeholder-gray-400 focus:ring-[#F7DD0F] focus:border-[#F7DD0F]"
                            />
                          </div>
                          <div>
                            <Label htmlFor="subtitle" className="text-white">Subtitle</Label>
                            <Input
                              id="subtitle"
                              value={editForm.subtitle || ''}
                              onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                              className="bg-black/50 border-[#F7DD0F]/30 text-white placeholder-gray-400 focus:ring-[#F7DD0F] focus:border-[#F7DD0F]"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-white">Description</Label>
                          <Textarea
                            id="description"
                            value={editForm.description || ''}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            rows={2}
                            className="bg-black/50 border-[#F7DD0F]/30 text-white placeholder-gray-400 focus:ring-[#F7DD0F] focus:border-[#F7DD0F]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="button_text" className="text-white">Button Text</Label>
                            <Input
                              id="button_text"
                              value={editForm.button_text || ''}
                              onChange={(e) => setEditForm({ ...editForm, button_text: e.target.value })}
                              className="bg-black/50 border-[#F7DD0F]/30 text-white placeholder-gray-400 focus:ring-[#F7DD0F] focus:border-[#F7DD0F]"
                            />
                          </div>
                          <div>
                            <Label htmlFor="display_order" className="text-white">Display Order</Label>
                            <Input
                              id="display_order"
                              type="number"
                              value={editForm.display_order || 0}
                              onChange={(e) => setEditForm({ ...editForm, display_order: parseInt(e.target.value) || 0 })}
                              className="bg-black/50 border-[#F7DD0F]/30 text-white placeholder-gray-400 focus:ring-[#F7DD0F] focus:border-[#F7DD0F]"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="button_link" className="text-white">Link URL</Label>
                          <Input
                            id="button_link"
                            placeholder="Enter link URL (e.g., /product/123 or https://example.com)"
                            value={editForm.button_link || ''}
                            onChange={(e) => setEditForm({ ...editForm, button_link: e.target.value })}
                            className="bg-black/50 border-[#F7DD0F]/30 text-white placeholder-gray-400 focus:ring-[#F7DD0F] focus:border-[#F7DD0F]"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            When users click on this carousel slide, they will be redirected to this URL
                          </p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-[#F7DD0F]/20">
                          <div>
                            <Label className="text-white font-medium">Show Content</Label>
                            <p className="text-xs text-gray-400 mt-1">
                              Display title, subtitle, and description on this carousel slide
                            </p>
                          </div>
                          <Switch
                            checked={editForm.show_content !== false}
                            onCheckedChange={(checked) => setEditForm({ ...editForm, show_content: checked })}
                            className="data-[state=checked]:bg-[#F7DD0F] data-[state=unchecked]:bg-gray-600"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={saveEdit} 
                            size="sm"
                            className="bg-[#F7DD0F] text-black hover:bg-[#F7DD0F]/90"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button 
                            onClick={cancelEdit} 
                            variant="outline" 
                            size="sm"
                            className="border-[#F7DD0F]/30 text-[#F7DD0F] hover:bg-[#F7DD0F]/10"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white">{image.title}</h4>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => startEditing(image)}
                              variant="outline"
                              size="sm"
                              className="border-[#F7DD0F]/30 text-[#F7DD0F] hover:bg-[#F7DD0F]/10"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(image.id)}
                              variant="destructive"
                              size="sm"
                              className="bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        {image.subtitle && (
                          <p className="text-sm text-gray-300">{image.subtitle}</p>
                        )}
                        {image.description && (
                          <p className="text-sm text-gray-400 line-clamp-2">{image.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            image.is_active 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {image.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span>Order: {image.display_order}</span>
                          {image.button_text && (
                            <span>Button: {image.button_text}</span>
                          )}
                          {image.button_link && (
                            <span className="text-[#F7DD0F]">Link: {image.button_link}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
