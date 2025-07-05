import bcrypt from 'bcrypt';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IUser } from '../../domain/entities/IUser'
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import {
    generateAccessToken,
    generateRefreshToken
} from "../../utils/jwtUtils"

export class UserUseCases {
  constructor(private userRepository: IUserRepository) {}
  async login(
      email: string,
      password: string
  ): Promise<{
      token: string,
      refreshToken: string,
      userData: IUser
  }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw {statusCode: HttpStatusCode.UNAUTHORIZED, message:"Invalid credentials"};
    }
    
    const token = generateAccessToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id, email: user.email });
    
    const safeUser = await this.userRepository.findById(user._id);
    if (!safeUser) {
        throw {statusCode: HttpStatusCode.NOT_FOUND, message:"User data retrieval failed"};
    }

    return {
      token,
      refreshToken,
      userData: safeUser,
    };    
  }


}