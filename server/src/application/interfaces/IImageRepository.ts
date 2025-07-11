import { IImage } from "../../domain/entities/IImage"; 

export interface IImageRepository {
  saveImage(image: IImage): Promise<IImage>;
  getImagesByUser(userId: string): Promise<IImage[]>;
}
