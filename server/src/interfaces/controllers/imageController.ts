
import { Request, Response } from "express";
import { ImageUseCase } from "../../application/useCases/imageUseCase"; 
import { ImageRepository } from "../../infrastructure/database/repository/ImageRepository"; 
import { HttpStatusCode } from "../../enums/HttpStatusCode";

const imageUseCase = new ImageUseCase(new ImageRepository());

export const uploadImages = async (req: Request, res: Response) => {
  try {
    
    const userId = req.body.userId;
    const titles = req.body.titles || "[]";
    const files = req.files as Express.Multer.File[];

    const images = await imageUseCase.uploadAndSaveImages(files, titles, userId);
    res.status(201).json({ success: true, images });
  } catch (error: any) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserImages = async (req: Request, res: Response) => {
  const userId = req.user?.id
  console.log(userId);
  
  if(!userId) {
    throw { 
      statusCode: HttpStatusCode.UNAUTHORIZED,
      message: 'Access Denied: User not found'
    }
  }

  const images = await imageUseCase.getImagesByUser(userId)
  res.json({ images })
}