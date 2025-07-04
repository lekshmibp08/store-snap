import { IUserRepository } from "../../../application/interfaces/IUserRepository"; 
import User from "../models/userModel"; 
import { IUser } from "../../../domain/entities/IUser"; 

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }) as IUser;
  }

  async createUser(user: IUser): Promise<IUser> {
    return await User.create(user);
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id) as IUser;
  }

  async updateUser(userId: string, updateData: any) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
  }
}
