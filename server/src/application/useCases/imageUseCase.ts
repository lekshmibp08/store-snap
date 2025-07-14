import { IImageRepository } from "../interfaces/IImageRepository";
import fs from 'fs';
import { cloudinary } from "../../config/cloudinaryConfig"; 
import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { uploadToCloudinary } from "../../infrastructure/services/cloudinaryService";

interface ImageOrderUpdate {
  id: string;
  order: number;
}

export class ImageUseCase {
  constructor(private imageRepository: IImageRepository) {};
  
  async uploadAndSaveImages(files: Express.Multer.File[], titles: string[], userId: string) {

    const existingImages = await this.imageRepository.getImagesByUser(userId);
    let currentMaxOrder = existingImages.length > 0
      ? Math.max(...existingImages.map(img=>img.order ?? 0))
      : -1
     
    const images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = file.path;
     
      const result = await uploadToCloudinary(filePath, 'my-images')      

      const { secure_url, public_id, bytes }: any = result;

      const saved = await this.imageRepository.saveImage({
        title: titles[i] || file.originalname,
        url: secure_url,
        size: bytes,
        publicId: public_id,
        userId,
        order: ++currentMaxOrder,        
      });      

      images.push(saved);
      fs.unlinkSync(filePath);
    }
    return images;
  };

  async getImagesByUser(userId: string) {
    
    return await this.imageRepository.getImagesByUser(userId);
  }

  async deleteImage(imageId: string) {
    const image = await this.imageRepository.getImageById(imageId);
    if(!image) {
      throw {
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Image not found'
      }
    }
    await cloudinary.uploader.destroy(image.publicId);
    const deletedImage = await this.imageRepository.deleteImage(imageId);
    if(!deletedImage) {
      throw {
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Image not found'
      }
    }

  };

  async editImage(imageId: string, newTitle: string, newFile?: Express.Multer.File) {
    
    const image = await this.imageRepository.getImageById(imageId);
    if (!image) {
      throw {
        statusCode: HttpStatusCode.NOT_FOUND,
        message: "Image not found",
      };
    }

    let updatedFields: Partial<{
      title: string;
      url: string;
      size: number;
      publicId: string;
    }> = {
      title: newTitle || image.title,
    };

    if (newFile) {
      const filePath = newFile.path;

      await cloudinary.uploader.destroy(image.publicId);

      const result = await uploadToCloudinary(filePath, "my-images");

      const { secure_url, public_id, bytes }: any = result;
      updatedFields = {
        ...updatedFields,
        url: secure_url,
        size: bytes,
        publicId: public_id,
      };

      fs.unlinkSync(filePath);
    }

    const updatedImage = await this.imageRepository.updateImage(imageId, updatedFields);
    return updatedImage;
  }

  async updateImageOrder(images: ImageOrderUpdate[], userId: string) {
    for (const image of images) {
      const existing = await this.imageRepository.getImageById(image.id);
      if (!existing || existing.userId.toString() !== userId) {
        throw {
          statusCode: 403,
          message: "Unauthorized to update image order",
        };
      }

      await this.imageRepository.updateImageOrder(image.id, image.order);
    }
  }  

}