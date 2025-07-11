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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body
  try {
    await userUseCases.sendPasswordResetOtp(email)
    res.status(HttpStatusCode.OK).json({ message: "OTP sent to email" })
  } catch (error: any) {
    next(error)
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, newPassword } = req.body;
    await userUseCases.verifyOtpAndResetPassword(email, otp, newPassword);
    res.status(HttpStatusCode.OK).json({ message: "Password reset successful" });
  } catch (error: any) {
    next(error)
  }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw {
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "No refresh token provided",
      }
    }

    const newAccessToken = await userUseCases.refreshAccessToken(refreshToken);

    res.status(HttpStatusCode.OK).json({ token: newAccessToken });

  } catch (error: any) {
    next(error)
  }
};