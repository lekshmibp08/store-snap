import { IImageRepository } from "../../../application/interfaces/IImageRepository"; 
import Image from "../models/imageModel"; 
import { IImage } from "../../../domain/entities/IImage";   

export class ImageRepository implements IImageRepository {
  async saveImage(image: IImage): Promise<IImage> {
    const createdImage = await Image.create(image);

    return IImage.fromDocument(createdImage);
  };

  async getImagesByUser(userId: string): Promise<IImage[]> {
    const documents = await Image.find({ userId }).sort({ order: 1 }).exec();
    return documents.map(IImage.fromDocument);
  };

  
}
