import { Types } from 'mongoose';

export class IUser{
    constructor(
        public _id: Types.ObjectId | string, 
        public name: string,
        public email: string,
        public password: string,
        public phone: string,
    ){}
}