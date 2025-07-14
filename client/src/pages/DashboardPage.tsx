
import type React from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { ImageIcon, Cloud, Calendar } from "lucide-react"
import Header from "../components/layout/Header"
import StatsCard from "../components/images/StatsCard"
import ImageUpload from "../components/images/ImageUpload"
import ImageGallery from "../components/images/ImageGallery"
import type { RootState } from "../store"
import type { Image } from "../types/types"
import { getImages } from "../api/imageApi"

const DashboardPage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([])
  const { user } = useSelector((state: RootState) => state.auth)


  useEffect(() => {
    const fetchImages = async() => {
      const result = await getImages();
      if(result.success) {        
        setImages(result.data.sort((a: Image,b: Image) => a.order - b.order))
      }
    }
    fetchImages();
  }, [user])

  const handleImagesUploaded = (newImages: Image[]) => {
    setImages((prev) => [...prev, ...newImages].sort((a, b) => a.order - b.order))
  }

  const handleImagesUpdate = (updatedImages: Image[]) => {
    setImages(updatedImages)

    const allImages = JSON.parse(localStorage.getItem("images") || "[]")
    const otherUsersImages = allImages.filter((img: Image) => img.userId !== user?._id)
    const newAllImages = [...otherUsersImages, ...updatedImages]
    localStorage.setItem("images", JSON.stringify(newAllImages))
  }

  const totalSize = images.reduce((acc, img) => {
    return acc + img.size
  }, 0)

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-[var(--bg-color)] text-[var(--text-color)] mb-2">Welcome to your Image Album! 🎨</h1>
          <p className="text-gray-600 text-lg">Manage, organize, and showcase your beautiful images with ease.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Images" value={images.length} icon={ImageIcon} bgColor="bg-blue-500" />
          <StatsCard title="Storage Used" value={`${(totalSize/(1024 * 1024)).toFixed(2)} MB`} icon={Cloud} bgColor="bg-green-500" />
          <StatsCard
            title="This Month"
            value={
              images.filter((img) => {
                const imgDate = new Date(img.createdAt)
                const now = new Date()
                return imgDate.getMonth() === now.getMonth() && imgDate.getFullYear() === now.getFullYear()
              }).length
            }
            icon={Calendar}
            bgColor="bg-purple-500"
          />
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <ImageUpload onImagesUploaded={handleImagesUploaded} />
        </div>

        {/* Gallery Section */}
        <ImageGallery images={images} onImagesUpdate={handleImagesUpdate} />
      </main>
    </div>
  )
}

export default DashboardPage
