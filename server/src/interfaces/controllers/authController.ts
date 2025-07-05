import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../infrastructure/database/repository/UserRepository'; 
import { OtpRepository } from '../../infrastructure/database/repository/OtpRepository';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { sendOtpUseCase } from '../../application/useCases/sendOtpUseCase'; 
import { verifyAndRegisterUser } from '../../application/useCases/verifyAndRegisterUser';
import { UserUseCases } from '../../application/useCases/userUseCases';

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const userUseCases = new UserUseCases(userRepository);

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone } = req.body;
    const result = await sendOtpUseCase(email, phone, userRepository, otpRepository);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyOtpAndRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    const result = await verifyAndRegisterUser(userData, userRepository, otpRepository);
    res.status(HttpStatusCode.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const userLogin = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw {
        statusCode: HttpStatusCode.BAD_REQUEST, 
        message:"Missing credentials"
      };
    }

    const { token, refreshToken, userData } = await userUseCases.login(email, password);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatusCode.OK).json({
      token,
      user: userData,
    });

  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body
  try {
    await userUseCases.sendPasswordResetOtp(email)
    res.status(200).json({ message: "OTP sent to email" })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    await userUseCases.verifyOtpAndResetPassword(email, otp, newPassword);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || "Reset failed" });
  }
};

