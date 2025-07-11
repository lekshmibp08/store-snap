import type React from "react"
import { useState } from "react"
import { Save, Target } from "lucide-react"
import ImageCard from "./ImageCard"
import type { Image } from "../../types/types"

interface ImageGalleryProps {
  images: Image[]
  onImagesUpdate: (images: Image[]) => void
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImagesUpdate }) => {
  const [draggedItem, setDraggedItem] = useState<Image | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, image: Image) => {
    setDraggedItem(image)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (!draggedItem) return

    const dragIndex = images.findIndex((img) => img.id === draggedItem.id)
    if (dragIndex === dropIndex) return

    const newImages = [...images]
    const [removed] = newImages.splice(dragIndex, 1)
    newImages.splice(dropIndex, 0, removed)

    // Update order property
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      order: index,
    }))

    onImagesUpdate(updatedImages)
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handleEdit = (id: string, title: string, file?: File) => {
    const updatedImages = images.map((img) => {
      if (img.id === id) {
        return {
          ...img,
          title,
          url: file ? URL.createObjectURL(file) : img.url,
          file: file || img.file,
        }
      }
      return img
    })
    onImagesUpdate(updatedImages)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      const updatedImages = images.filter((img) => img.id !== id)
      onImagesUpdate(updatedImages)
    }
  }

  const saveArrangement = () => {
    localStorage.setItem("images", JSON.stringify(images))
    alert("Image arrangement saved successfully! 🎉")
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">🖼️ Your Image Gallery</h2>
          <p className="text-gray-600 mt-1">{images.length} images in your album</p>
        </div>
        <button
          onClick={saveArrangement}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <Save size={16} />
          Save Arrangement
        </button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No images yet</h3>
          <p className="text-gray-500">Upload some images to get started!</p>
        </div>
      ) : (
        <>
          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, image)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={`cursor-move transition-all duration-200 ${
                  dragOverIndex === index ? "ring-4 ring-blue-300 ring-opacity-50 scale-105" : ""
                }`}
              >
                <ImageCard
                  image={image}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDragging={draggedItem?.id === image.id}
                />
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl">
              <p className="text-blue-800 text-base flex items-center justify-center gap-3">
                <Target size={24} />
                <span>
                  <strong>Interactive Features:</strong> Drag images to reorder • Click Edit to rename images • Delete
                  unwanted images • Upload new images with drag & drop support
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ImageGallery
