import { IImage } from "../../domain/entities/IImage"; 

export interface IImageRepository {
  saveImage(image: IImage): Promise<IImage>;
  getImagesByUser(userId: string): Promise<IImage[]>;
  getImageById(imageId: string): Promise<IImage>;
  deleteImage(imageId: string): Promise<IImage | null>;
  updateImage(imageId: string, updates: Partial<IImage>): Promise<IImage | null>;
}
