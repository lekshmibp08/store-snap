import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../infrastructure/database/repository/UserRepository'; 
import { OtpRepository } from '../../infrastructure/database/repository/OtpRepository';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { sendOtpUseCase } from '../../application/useCases/sendOtpUseCase'; 
import { verifyAndRegisterUser } from '../../application/useCases/verifyAndRegisterUser';

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();

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

