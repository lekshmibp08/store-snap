import configAxios from "../services/axiosConfig"; 
import type { Image } from "../types/types";

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

export const getImages = async () => {
  try {
    const response = await configAxios.get("/api/images")
    return { success: true, data: response.data.images }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message }
  }
}

export const deleteImage = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await configAxios.delete(`/api/images/${id}`);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Delete failed",
    };
  }
};

export const editImage = async (
  id: string,
  title: string,
  file?: File
): Promise<{ success: boolean; image?: Image; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    if (file) formData.append("image", file);

    const res = await configAxios.put(`/api/images/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, image: res.data.image };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Updation failed. Please try again.",
    };
  }
};