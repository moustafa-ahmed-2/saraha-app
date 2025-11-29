
import joi from "joi"
import { generateFields } from "../../middleware/validation.middleware.js"
import { resetPassword } from "./auth.service.js"

export const registerScema = joi.object({

    fullName:generateFields.name,
    email:generateFields.email ,
    password:generateFields.password,
    resetPassword:generateFields.rePassword("password"),
    phoneNumber:generateFields.phoneNumber , 
    dob:generateFields.dob
}).or("email","phoneNumber")




export const loginScema = joi.object({
    email:generateFields.email,
    phoneNumber:generateFields.phoneNumber,
    password:generateFields.password

})




export const resetPasswordScema =  joi.object({
email:generateFields.email.required(),
otp:generateFields.otp.required(),
newPassword:generateFields.password.required(),
rePassword:generateFields.rePassword("newPassword").required()



})








