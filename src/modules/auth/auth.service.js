
// register

import { User } from "../../DB/model/user.model.js"
// import bcrypt from 'bcrypt';
import { sendMail } from "../../utiles/email/index.js";
import { generateoTP } from "../../utiles/otp/index.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken"
import joi from "joi";
import { comparePassword, hashPassword } from "../../utiles/hash/index.js";
import { Token } from "../../DB/model/token.model.js";
import { generateToken } from "../../utiles/token/index.js";



export const register = async (req,res,next)=>{


try {
    

// get data from req

const {fullName,email , password,phoneNumber , dob} = req.body


// check user Existence

const userExistence = await User.findOne({

$or:[ 
    
    


{
    $and:[
   
        { email:{$ne:null}} ,
        {email:{$exists:true}},
        {email:email}
    
]
}
    
    
,


{
    $and:[
   
        { phoneNumber:{$ne:null}} ,
        {phoneNumber:{$exists:true}},
        {phoneNumber:phoneNumber}
    
]
}
    







]


})


if(userExistence){

   return res.status(409).json({ message: "User already exists", success: false });

    
}




const user = new User({

fullName,
email,
password:hashPassword(password),
phoneNumber,
dob


})
const otp = Math.floor(Math.random() * 90000 + 10000  )  // generate otp
const otpExpire = Date.now() + 15 * 60 * 1000; 
user.otp=otp;
user.otpExpire=otpExpire

// send email
if(email)
    {  await sendMail({
    to:email,
    subject:"verify your Email",
    html:`<p> your otp to verify accout is ${otp} </p>`
})
}



// user.fullName = fullName;
await user.save()


// create user
return res.status(201).json({message:"user created successfully" , success:true ,  user: user.toJSON()})



// prepare data >> hash password
// send email
// send response















} catch (error) {

return res.status(500).json({ message: error.message, success: false });

    
}



}

export const verifyAccount = async (req,res,next)=>{

try {
    // get data from req
const {otp , email} = req.body
// check user otp & otpExpire

const userExist = await User.findOne({
    email,otp,otpExpire:{$gt:Date.now()}
})
if(!userExist){
    throw new Error("Invalid otp" , {cause:401} )
}
//update user => isVerified => true
userExist.isVerified = true;
userExist.otp=undefined;
userExist.otpExpire=undefined


await userExist.save();
return res.status(200).json({
    message:"user verified successfully",
    success:true
})

// send response



} catch (error) {
 
  return res.status(error.cause || 500).json({
    message: error.message,
    success: false
})

 

}


}



export const googleLogin = async (req,res,next)=>{
// get data from req
const {idToken} = req.body;
// verify idToken
const client = new OAuth2Client("961021991221-778e39s5rmqqfdbtigqc90h8c7mdii0n.apps.googleusercontent.com")

const ticket =  await client.verifyIdToken({idToken})
const payload = ticket.getPayload() // {email , name , phone , picture , dob}
let  userExist = await User.findOne({email:payload.email})
if(!userExist){   //      if not exist I will be create
 userExist = await User.create({
    fullName:payload.fullName,
    email:payload.email,
    phoneNumber:payload.phone,
    dob:payload.birthdate,
    isVerified:true,
    userAgent:"google"

})
}

// generate token
// const token = jwt.sign({id:userExist._id ,name:userExist.fullName} ,  "Ajdhhbywywh", {expiresIn:"15m"} )
const accessToken = generateToken({
  payload: { id: userExist._id },
  option: { expiresIn: "1d" }
})

// generate refresh token
const refreshToken = generateToken({
  payload: { id: userExist._id },
  option: { expiresIn: "7d" }
})

// store refresh token in DB
await Token.create({ token: refreshToken, user: userExist._id, type: "refresh" })




// send response
return res.status(200).json({message:"login successfully" , success:true , data:{accessToken , refreshToken}})



}




export const sendoTP = async (req,res,next)=>{

try {
    // get data from req
const {email} = req.body

//generate new otp && otpExpire
const {otp , otpExpire} = generateoTP()
//update user
const userExist = await User.findOneAndUpdate({email},{otp,otpExpire})
if(!userExist){
    throw new Error ("user not found",{cause:404})
}


// send email
await sendMail({
    to:email,
    subject:"send otp",
    html:`<p>Your otp to verify your account ${otp} </p> `
})

//send response
return res.status(200).json({message:"otp resend successfully" , success:true})

} catch (error) {
 
  return res.status(error.cause || 500).json({
    message: error.message,
    success: false
})

 
}
}



export const login = async (req , res , next)=>{


    try {
        
// get data from req
const {email,phoneNumber , password} = req.body

// check user Existence

const userExistence = await User.findOne({



$or:[ 
    


{
    $and:[
   
        { email:{$ne:null}} ,
        {email:{$exists:true}},
        {email:email}
    
]
}
    
    
,


{
    $and:[
   
        { phoneNumber:{$ne:null}} ,
        {phoneNumber:{$exists:true}},
        {phoneNumber:phoneNumber}
    
]
}
    


]


})

if(!userExistence){
throw new Error("Invalid credential" , {cause:409}  )    
}

// compare password


const match =comparePassword(password,userExistence.password)

if(!match){
    throw new Error("Invalid credential" , {cause:401}  )  
}
if(userExistence.deletedAt){
  userExistence.deletedAt = undefined;
  await userExistence.save()
}

//  generate token


// generate token
// const token = jwt.sign({id:userExistence._id ,name:userExist.fullName} ,  "Ajdhhbywywh", {expiresIn:"15m"} )
const accessToken = generateToken(
    {
        payload:{id:userExistence._id},
        option:{expiresIn:"15m"},

    
    })

const refreshToken = generateToken({
    payload:{id:userExistence._id},
    option:{expiresIn:"5s"}
})
// store in db
await Token.create({token:refreshToken,user:userExistence._id,type:"refresh"})


// send response
return res.status(200).json({message:"login successfully" , success:true , data:{accessToken,refreshToken}})








// return res.status(200).json({message:"logged successfully" , success:true , data:userExistence})




// send response






    } catch (error) {
  return res.status(500).json({ message: error.message, success: false });
        
    }




}




export const resetPassword = async(req,res,next)=>{
  const { email, otp, newPassword } = req.body;


    const userExistence = await User.findOne({ email });
    if (!userExistence) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    if (userExistence.otp != otp) {
      const error = new Error("Invalid OTP");
      error.status = 400;
      throw error;
    }

    if (userExistence.otpExpire < Date.now()) {
      const error = new Error("OTP Expired");
      error.status = 400;
      throw error;
    }

    userExistence.password = hashPassword(newPassword);
    userExistence.credentialUpdatedAt = Date.now()
    userExistence.otp = undefined;
    userExistence.otpExpire = undefined
     await userExistence.save();
    // destroy all refresh token 
    await Token.deleteMany({user:userExistence._id , type:"refresh" })

    return res.status(200).json({
      message: "Password reset successfully",
      success: true
    });


}







export const logout = async(req,res,next)=>{

    // get data from req
    const {token} = req.headers.authorization;
    // store token in DB
  await  Token.create({token,user:req.user._id})

  return res.status(200).json({message:"user logout suxxessfully"})




}


