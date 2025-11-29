
import { Router } from "express";

import { isValid } from "../../middleware/validation.middleware.js";
import { getMessageSchema, sendMessageSchema } from "./message.validation.js";
import { getmessage, sendMessage } from "./message.service.js";
import  {fileUpload}  from "../../utiles/multer/multer.cloud.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";


const router = Router()




router.post("/:receiver", fileUpload().array("attachments", 2 ),isValid(sendMessageSchema),sendMessage  )
router.post("/:receiver/sender", isAuthenticated ,fileUpload().array("attachments", 2 ),isValid(sendMessageSchema),sendMessage  )
router.get("/:id",isAuthenticated,isValid(getMessageSchema),getmessage)



export default router





