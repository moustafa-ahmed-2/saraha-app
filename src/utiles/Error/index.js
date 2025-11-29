import { Token } from "../../DB/model/token.model.js";
import { generateToken, verifyToken } from "../token/index.js";





export const globalErrorhandler=  async(err,req,res, next)=>{

//   if(req.file){
//     fs.unlinkSync(req.file.path)
//   }




try {
  
  console.log(err);
  
    if(err.message=="jwt Expired"){
    const refreshToken = req.headers.refreshToken;
const payload = verifyToken(refreshToken);
const tokenExist = await Token.findOneAndDelete({
    token:refreshToken,
    user:payload.id,
    type:"refresh"
 }) 

if(!tokenExist){
    throw new Error("Invalid refresh token", {cause:401}  )
    // logout from all devices 
}
const accessToken = generateToken({
    payload:{id:payload.id},
    option:{expiresIn:"15m"}
})
const newRefreshToken = generateToken({
    payload:{id:payload.id},
    option:{expiresIn:"7d"}
})

await Token.create({
    token:newRefreshToken,
    user:payload.id,
    type:"refresh"
})

return res.status(200).json({
    message:"token refresh successfully",
    success:true,
    data:{accessToken,refreshToken:newRefreshToken}
})



}



  res.status(err.cause || 500).json({
    message:err.message,
    success:false,
    globalErrorHandler:true,
    stack:err.stack,
    error:err
  })

} catch (err) {
  console.log(err);
  
  res.status(err.cause || 500).json({
    message:err.message,
    success:false,
    globalErrorHandler:true,
    stack:err.stack,
    error:err
  })  
}
}




