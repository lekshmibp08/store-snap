import { Types } from "mongoose";

export class IImage {
    constructor(
        public title: string,
        public url: string,
        public size: number,
        public publicId: string,
        public userId: string,
        public order: number,
        public _id?: Types.ObjectId | string,
        public createdAt?: Date
    ){}

    static fromDocument(doc: any): IImage {
      return new IImage(
        doc.title,
        doc.url,
        doc.size,
        doc.publicId,
        doc.userId.toString(),
        doc.order,
        doc._id?.toString(),
        doc.createdAt
      );
    }
}

