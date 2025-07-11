import configAxios from "../services/axiosConfig"; 

export const uploadImages = async (
  files: File[],
  titles: string[],
  userId?: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const formData = new FormData()

    files.forEach((file, index) => {
      formData.append("images", file)
      formData.append("titles", titles[index] || file.name.replace(/\.[^/.]+$/, ""))
    })
    
    if(userId) {
        formData.append("userId", userId);
    }

    const response = await configAxios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userId || ""}`,
      },
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Image upload failed",
    }
  }
}

export const getImages = async (token: string) => {
  try {
    const response = await configAxios.get("/api/images", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data: response.data.images }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message }
  }
}