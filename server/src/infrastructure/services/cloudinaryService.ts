import fs from 'fs'
import { cloudinary } from '../../config/cloudinaryConfig'


export const uploadToCloudinary = async (filePath: string, folder: string) => {
    let buffer = fs.readFileSync(filePath);
    
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
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

    return { 
        secure_url: result.secure_url, 
        public_id: result.public_id, 
        bytes: result.bytes 
    }

}