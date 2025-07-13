
import { NextFunction, Request, Response } from "express";
import { ImageUseCase } from "../../application/useCases/imageUseCase"; 
import { ImageRepository } from "../../infrastructure/database/repository/ImageRepository"; 
import { HttpStatusCode } from "../../enums/HttpStatusCode";

const imageUseCase = new ImageUseCase(new ImageRepository());

export const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const userId = req.body.userId;
    const titles = req.body.titles || "[]";
    const files = req.files as Express.Multer.File[];

    const images = await imageUseCase.uploadAndSaveImages(files, titles, userId);
    res.status(201).json({ images });
  } catch (error: any) {
    console.error("Upload Error:", error);
    next(error)
  }
};

export const getUserImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id
    
    if(!userId) {
      throw { 
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: 'Access Denied: User not found'
      }
    }
  
    const images = await imageUseCase.getImagesByUser(userId)
    res.status(200).json({ images })
    
  } catch (error) {
    next(error)
  }
};

export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await imageUseCase.deleteImage(id);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const editImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const file = req.file;

    const updated = await imageUseCase.editImage(id, title, file);
    res.status(200).json({ success: true, image: updated });
  } catch (error: any) {
    next(error);
  }
};

export const updateImageOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { images } = req.body; 
    const userId = req.user?.id;

    if(!userId) {
      throw { 
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: 'Access Denied: User not found'
      }
    }    

    await imageUseCase.updateImageOrder(images, userId);

    res.status(200).json({ success: true, message: "Order updated successfully" });
  } catch (error: any) {
    next(error);
  }
};