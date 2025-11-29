import { Token } from "../DB/model/token.model.js";
import { User } from "../DB/model/user.model.js";
import { verifyToken } from "../utiles/token/index.js";

export const isAuthenticated =  async (req,res,next)=>{
 
 const token = req.headers.authorization;
 if(!token){
  throw new Error("token is required" , {cause:401})
 }

const payload = verifyToken(token)
// check in deb
const blockedToken = await Token.findOne({token,type:"access"})
if(blockedToken){
  throw new Error("token is invaled ",{cause:401})
}



const userExist = await User.findById(payload.id)
if(!userExist){
  throw new Error("User not found",{cause:404})
}

// console.log(
// {  credentialUpdatedAt:userExist.credentialUpdatedAt , iat:new Date(payload.iat * 1000)}
// );


if(userExist.credentialUpdatedAt > new Date (payload.iat * 1000)  ){
  throw new Error("token expired", {cause:401}   )
}


req.user = userExist
return next()

  }