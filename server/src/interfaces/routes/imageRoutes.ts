import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { 
    uploadImages,
    getUserImages,
    deleteImage,
    editImage,
    updateImageOrder
} from '../controllers/imageController'
import upload from "../../utils/multer";

const router = express.Router();

router.post("/upload", verifyToken, upload.array('images'), uploadImages);
router.get("/images", verifyToken, getUserImages);
router.put("/images/reorder", verifyToken, updateImageOrder);
router.delete("/images/:id", verifyToken, deleteImage);
router.put("/images/:id", verifyToken, upload.single("image"), editImage);

export default router;
