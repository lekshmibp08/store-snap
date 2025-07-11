import type React from "react"
import { useState } from "react"
import { Edit2, Trash2, Calendar } from "lucide-react"
import Button from "../ui/Button"
import Modal from "../ui/Modal"
import Input from "../ui/Input"
import type { Image } from "../../types/types"

interface ImageCardProps {
  image: Image
  onEdit: (id: string, title: string, file?: File) => void
  onDelete: (id: string) => void
  isDragging?: boolean
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onEdit, onDelete, isDragging = false }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(image.title)
  const [editFile, setEditFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleEditSubmit = () => {
    onEdit(image._id, editTitle, editFile || undefined)
    setIsEditModalOpen(false)
    setEditFile(null)
    setPreviewUrl(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group ${
          isDragging ? "scale-105 shadow-xl rotate-2" : ""
        }`}
      >
        <div className="relative">
          <img src={image.url || "/placeholder.svg"} alt={image.title} className="w-full h-48 object-cover" />
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Calendar size={12} />
            {new Date(image.createdAt).toLocaleDateString()}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate" title={image.title}>
            {image.title}
          </h3>
          <p className="text-sm text-gray-500 mb-4">{(image.size / (1024 * 1024)).toFixed(2)}MB</p>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              <Edit2 size={14} />
              Edit
            </button>
            <button
              onClick={() => onDelete(image._id)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Image">
        <div className="space-y-4">
          <Input label="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Replace Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {previewUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Image Preview</label>
              <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-32 object-cover rounded" />
            </div>
          )}
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleEditSubmit}>Save Changes</Button>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ImageCard
