import { IUser } from "../../domain/entities/IUser"; 
import { Types } from "mongoose";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  createUser(user: IUser): Promise<IUser>;
  findById(id: string | Types.ObjectId): Promise<IUser | null>;
  updateUser(userId: string | Types.ObjectId, updateData: any): Promise<IUser | null >;
}
