import { User } from "../../DB/model/user.model.js";
import fs from "fs"
import jwt from "jsonwebtoken";
import { verifyToken } from "../../utiles/token/index.js";
import cloudinary, { delteFolder } from "../../utiles/cloud/cloudinary.config.js";




export const deleteAccount = async (req, res, next) => {
  try {
await delteFolder(`c44-saraha/users/${req.user._id}`)


await User.updateOne({_id:req.user._id},  {deletedAt:Date.now(), credentialUpdatedAt:Date.now()   })
await Token.deleteMany({user:req.user._id})



    return res
      .status(200)
      .json({ message: "deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
















export const uploadProfilePicture = async(req , res , next)=> {


try {

    
//   res.json({reqFile:req.file})
    // res.send("Done")

// update user login >> req.files
// const token = req.headers.authorization
// const {id  } = verifyToken(token) 
// if(req.user.profilePic){

//   fs.unlinkSync(req.user.profilePic)

// }

if (req.user.profilePic && fs.existsSync(req.user.profilePic)) {
  fs.unlinkSync(req.user.profilePic);
}




const userExist =  await User.findByIdAndUpdate(
 req.user._id , {profilePic:req.file.path},{new:true}  )
if(!userExist){
    throw new Error("User not found" , {cause:404} )
}
return res.status(200).json({message:" upload profile successfully" , success:true , data:userExist})



} catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }



}






export const uploadProfilePictureCloud = async(req,res,next)=>{

  console.log("API_KEY:", process.env.API_KEY);
console.log("API_SECRET:", process.env.API_SECRET);
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
  // get data from req
  const user = req.user;
  const file = req.file;
  // delete file
// await  cloudinary.uploader.destroy(user.profilePic.public_id)
  // res.json({path:req.file.path})

  // update file
 const {secure_url,public_id} =   await  cloudinary.uploader.upload(req.file.path, 
{
 public_id:user.profilePic.public_id
}

   )
// update in db
 await User.updateOne({_id:req.user._id}, {profilePic:{secure_url,public_id}})

return res.status(200).json({message:"profile Pic Updated Successfully",success:true,data:{secure_url,public_id}})

}























import crypto from "crypto";
import { Token } from "../../DB/model/token.model.js";

export async function generateVerificationCode(userId) {
  const code = crypto.randomInt(100000, 999999).toString(); 
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); 
  await VerificationCode.findOneAndUpdate(
    { userId },
    { code, expiresAt, failedAttempts: 0, bannedUntil: null },
    { upsert: true, new: true }
  );


  console.log(" Verification code:", code);
}

export async function verifyCode(userId, inputCode) {
  const record = await VerificationCode.findOne({ userId });

  if (!record) return { success: false, message: "No code found" };


  if (record.bannedUntil && record.bannedUntil > Date.now()) {
    return { success: false, message: "You are banned, try later" };
  }

  
  if (record.expiresAt < Date.now()) {
    return { success: false, message: "Code expired" };
  }

  
  if (record.code === inputCode) {
    await VerificationCode.deleteOne({ userId });
    return { success: true, message: "Code verified successfully" };
  }

  record.failedAttempts += 1;

  if (record.failedAttempts >= 5) {
    record.bannedUntil = new Date(Date.now() + 5 * 60 * 1000); 
    record.failedAttempts = 0; 
  }

  await record.save();
  return { success: false, message: "Invalid code" };
}





export async function getProfile(req,res,next){

const user =   await  User.findOne({_id:req.user._id},{},{populate:[{path:"messages"}]})

  return res.status(200).json({message:"done",success:true,data:{user}})


}

