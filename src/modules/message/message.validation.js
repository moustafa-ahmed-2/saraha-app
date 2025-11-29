

import joi from "joi";
import { generateFields } from "../../middleware/validation.middleware.js";





export const sendMessageSchema = joi.object({

content:joi.string().min(3).max(1000),
receiver:generateFields.objectId.required().trim(),
sender:generateFields.objectId


})

.required()





export const getMessageSchema = joi.object({
    id:generateFields.objectId.required()
})
