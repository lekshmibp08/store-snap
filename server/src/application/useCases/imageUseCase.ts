import { IImageRepository } from "../interfaces/IImageRepository";
import fs from 'fs';
import sharp from 'sharp';
import { cloudinary } from "../../config/cloudinaryConfig"; 
import { HttpStatusCode } from "../../enums/HttpStatusCode";

export class ImageUseCase {
  constructor(private imageRepository: IImageRepository) {};
  
  async uploadAndSaveImages(files: Express.Multer.File[], titles: string[], userId: string) {
    
    const images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = file.path;

      let buffer = fs.readFileSync(filePath);
     
      if (file.size > 2 * 1024 * 1024) {
        console.log("WORKING");
        buffer = await sharp(filePath)
          .resize({ width: 1200 })
          .jpeg({ quality: 70 })
          .toBuffer();
      }

      const result = await new Promise<any>((resolve, reject) => {
        console.log("START");
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "my-images" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            }
            console.log("Upload successful");
            resolve(result);
          }
        );
      
        try {
          uploadStream.end(buffer);
        } catch (err) {
          console.error("Error ending upload stream:", err);
          reject(err);
        }
      });

      console.log("Result: ", result);
      

      const { secure_url, public_id, bytes }: any = result;

      const saved = await this.imageRepository.saveImage({
        title: titles[i] || file.originalname,
        url: secure_url,
        size: bytes,
        publicId: public_id,
        userId,
        order: i,        
      });

      console.log(saved);
      

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

}