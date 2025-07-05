import bcrypt from 'bcrypt';
import { IUserRepository } from '../interfaces/IUserRepository';
import { OtpRepository } from '../../infrastructure/database/repository/OtpRepository';
import { IUser } from '../../domain/entities/IUser'
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import {
    generateAccessToken,
    generateRefreshToken
} from "../../utils/jwtUtils"
import { sendEmail } from '../../infrastructure/services/emailService';

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
  };

  async sendPasswordResetOtp(email: string): Promise<void> {

    const otpRepository = new OtpRepository();
    const user = await this.userRepository.findByEmail(email);
    if(!user) {
      throw { statusCode: HttpStatusCode.NOT_FOUND, message: "User not found" };
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);

    await otpRepository.createOtp({
      email,
      otp,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000),
    });  
    
    await sendEmail(
      email,
      'Snap Store: Reset Password OTP',
      `Your OTP for Snap Store password reset is ${otp}. 
      It expires in 60 seconds.`
    );
    console.log('====================================');
    console.log(otp);
    console.log('====================================');
    
    return;
  };

  async verifyOtpAndResetPassword(
    email: string, otp: string, newPassword: string
  ): Promise<void> {
    const otpRepository = new OtpRepository();
    
    const otpExists = await otpRepository.findOtp(email, otp);
    if (!otpExists || new Date() > otpExists.expiresAt) {
      throw { statusCode: HttpStatusCode.BAD_REQUEST, message: "Invalid or expired OTP" };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await this.userRepository.updatePasswordByEmail(email, hashedPassword);

    if (!updated) {
      throw { statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR, message: "Password update failed" };
    }

    await otpRepository.deleteOtpByEmail(email);

    return;
  };



}