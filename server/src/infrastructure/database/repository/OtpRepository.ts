import { IOtpRepository } from "../../../application/interfaces/IOtpRepository"; 
import Otp from "../models/otpModel"; 
import { IOtp } from "../../../domain/entities/IOtp";  

export class OtpRepository implements IOtpRepository {
  async createOtp(otp: IOtp): Promise<IOtp> {
    return await Otp.create(otp);
  }

  async findOtp(email: string, otp: string): Promise<IOtp | null> {
    return await Otp.findOne({ email, otp }) as IOtp;
  }

  async deleteOtpByEmail(email: string): Promise<void> {
    await Otp.deleteOne({ email });
  }
}
