import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IOtpRepository } from "../interfaces/IOtpRepository";
import bcrypt from 'bcrypt';
import { IUser } from "../../domain/entities/IUser"; 

export const verifyAndRegisterUser = async (
  userData: IUser & { otp: string },
  userRepository: IUserRepository,
  otpRepository: IOtpRepository
) => {
  const { email, otp, password } = userData;

  const otpExists = await otpRepository.findOtp(email, otp);
  console.log('====================================');
  console.log(otpExists);
  console.log('====================================');
  if (!otpExists || new Date() > otpExists.expiresAt) {
    throw { statusCode: HttpStatusCode.BAD_REQUEST, message: "Invalid or expired OTP" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await userRepository.createUser({
    ...userData,
    password: hashedPassword,
  });

  await otpRepository.deleteOtpByEmail(email);

  return { message: "OTP verified and User registered successfully, You can now log in..!" };
};
