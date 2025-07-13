import type React from "react"
import { useState } from "react"
import { Save, Target } from "lucide-react"
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import ImageCard from "./ImageCard"
import type { Image } from "../../types/types"
import { deleteImage, editImage, updateImageOrder } from "../../api/imageApi" 
import Button from "../ui/Button";

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

    const dragIndex = images.findIndex((img) => img._id === draggedItem._id)
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

  const handleEdit = async (
    id: string, title: string, file?: File
  ) => {
    const result = await editImage(id, title, file);
    if(result.success && result.image) {
      const updated = images.map(img => (img._id === id ? result.image! : img));
      toast.success("Image updated successfully!");
      onImagesUpdate(updated);
    } else {
      toast.error(result.error || "File Updation failed. Please try again.");
    }    
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this image?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      const result = await deleteImage(id);
      if (result.success) {
        const updated = images.filter(img => img._id !== id);
        onImagesUpdate(updated);
        toast.success("Image deleted successfully!");
      } else {
        toast.error(result.error || "Delete failed. Please try again.");
      }
    }
  }

  const saveArrangement = async () => {
    const reorderd = images.map((img, index) => ({
      id: img._id,
      order: index,
    }))

    const result = await updateImageOrder(reorderd);

    if(result.success) {
      toast.success("Image order saved successfully!");
    } else {
      toast.error(result.error || "Failed to save order.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">🖼️ Your Image Gallery</h2>
          <p className="text-gray-600 mt-1">{images.length} images in your album</p>
        </div>
        <Button onClick={saveArrangement} variant="green" size="lg" className="flex flex-row gap-2">
          <Save size={25} />
          Save Arrangement
        </Button>
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
                key={image._id}
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
                  isDragging={draggedItem?._id === image._id}
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
