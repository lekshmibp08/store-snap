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
    return await User.findById(id).select("-password") as IUser;
  }

  async updateUser(userId: string, updateData: any) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
  }

  async updatePasswordByEmail(email: string, newHashedPassword: string): Promise<boolean> {
    const result = await User.updateOne({ email }, { password: newHashedPassword });
    return result.modifiedCount > 0;
  }
}
