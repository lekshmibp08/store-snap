export class IOtp {
    constructor(
        public email: string,
        public otp: string,
        public expiresAt: Date
    ){}
}