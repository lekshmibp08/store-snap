import type React from "react"
import { useState, useRef } from "react"
import { useSelector } from "react-redux"
import { Upload, AlertCircle, X } from "lucide-react"
import Input from "../ui/Input"
import type { Image } from "../../types/types"
import type { RootState } from "../../store"
import { uploadImages } from "../../api/imageApi"

interface ImageUploadProps {
  onImagesUploaded: (images: Image[]) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesUploaded }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [titles, setTitles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const { user } = useSelector((state: RootState) => state.auth)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxImages = 10

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setError("")

    // Check if adding new files would exceed the limit
    if (selectedFiles.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed. You can select ${maxImages - selectedFiles.length} more.`)
      return
    }

    // Filter out duplicates and invalid files
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        return false
      }
      return !selectedFiles.some((existing) => existing.name === file.name && existing.size === file.size)
    })

    setSelectedFiles((prev) => [...prev, ...validFiles])
    setTitles((prev) => [...prev, ...new Array(validFiles.length).fill("")])
  }

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
    setTitles((prev) => prev.filter((_, index) => index !== indexToRemove))
    setError("")
  }

  const handleTitleChange = (index: number, title: string) => {
    
    const newTitles = [...titles]
    newTitles[index] = title
    setTitles(newTitles)
  }
  
  const handleUpload = async () => {
    if (!user || selectedFiles.length === 0) return
    
    setLoading(true)
    setError("")
        
    const userId = user._id;   
    
    const result = await uploadImages(selectedFiles, titles, userId)

    if (result.success) {
      onImagesUploaded(result.data.images)
      setSelectedFiles([])
      setTitles([])
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } else {
      setError(result.error || "Upload failed")
      setLoading(false)
    }
    
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (selectedFiles.length + imageFiles.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed. You can select ${maxImages - selectedFiles.length} more.`)
      return
    }

    setSelectedFiles((prev) => [...prev, ...imageFiles])
    setTitles((prev) => [...prev, ...new Array(imageFiles.length).fill("")])
  }

  return (
    <div className="p-6 rounded-xl shadow-sm border border-gray-200"
      style={{
        backgroundColor: "var(--card-color)",
        color: "var(--text-color)",
        borderColor: "rgba(100, 116, 139, 0.2)",
      }}    
    >
      <h3 className="text-xl font-semibold text-[var(--text-color)] mb-4 flex items-center gap-2">
        <Upload size={20} />
        Upload New Images
      </h3>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center 
        hover:border-blue-400 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">Drop images here or click to browse</p>
        <p className="text-sm text-gray-500">Maximum {maxImages} images • PNG, JPG, JPEG up to 5MB each</p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Image Previews */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-700">
              Selected Images ({selectedFiles.length}/{maxImages})
            </h4>
            <button
              onClick={() => {
                setSelectedFiles([])
                setTitles([])
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-6">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative group">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white 
                    rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate max-w-20" title={file.name}>
                  {file.name}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <h4 className="font-medium text-gray-700">Add titles for your images:</h4>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  className="w-16 h-16 object-cover rounded"
                />
                <Input
                  placeholder={`Title for ${file.name}`}
                  value={titles[index] || ""}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  className="flex-1"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || selectedFiles.length === 0}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
            text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
