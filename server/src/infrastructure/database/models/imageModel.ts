import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  order: { type: Number, required: true },  
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema)
export default Image;
