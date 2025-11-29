


import { Router } from "express";
import { deleteAccount, generateVerificationCode, getProfile, uploadProfilePicture, uploadProfilePictureCloud, verifyCode } from "./user.service.js";
import { fileUpload } from "../../utiles/multer/multer.local.js";
import { fileUpload as fileUploadcloud } from "../../utiles/multer/multer.cloud.js";

import { fileValidationMiddleware } from "../../middleware/file-validation.middleware.js";
import { verifyToken } from "../../utiles/token/index.js";
import { User } from "../../DB/model/user.model.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";


const router = Router()


router.delete("/" ,  isAuthenticated, deleteAccount )


router.post(
  "/upload-profile-picture",
isAuthenticated,
  fileUpload( {folder:"profile-picture"} , ["image/png","image/jpeg","image/webp"]).single("profilePic"),
fileValidationMiddleware(),
  uploadProfilePicture
);
   

// router.post("/upload-cv",fileUpload({ allowedType: ["/application/pdf","application/msword"] , folder:"cv" }).single("cv"),uploadcv)
    
router.post("/upload-profile-cloud" , isAuthenticated,fileUploadcloud().single("profilePicture"),uploadProfilePictureCloud )    


router.post("/generate", generateVerificationCode);
router.post("/verify", verifyCode);

router.get("/",isAuthenticated, getProfile)


export default router







