import { HttpStatusCode } from "../../enums/HttpStatusCode"; 
import { IUserRepository } from "../interfaces/IUserRepository";
import { IOtpRepository } from "../interfaces/IOtpRepository";
import { sendEmail } from "../../infrastructure/services/emailService";  
import { log } from "console";

export const sendOtpUseCase = async (
  email: string,
  phone: string,
  userRepository: IUserRepository,
  otpRepository: IOtpRepository
) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw { statusCode: HttpStatusCode.BAD_REQUEST, message: "Email already exists!" };
  }
  console.log('email: ', email);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Generated OTP:', otp);

  await otpRepository.createOtp({
    email,
    otp,
    expiresAt: new Date(Date.now() + 1 * 60 * 1000),
  });

  await sendEmail(
    email,
    'Snap Store Signup Verification',
    `Your OTP for Snap Store signup verification is ${otp}. 
    It expires in 60 seconds.`
  );
  console.log('====================================');
  console.log(otp);
  console.log('====================================');

  return { message: "OTP sent successfully" };
};
