
import jwt from "jsonwebtoken"

export const verifyToken = (token ,  secretKey = "Ajdhhbywywh"  )=> {

 return  jwt.verify(token ,  secretKey )



}

export const generateToken = ({payload , secretKey="Ajdhhbywywh",option={expiresIn:"1d"}}  )=>{
return jwt.sign(payload,secretKey,option );



}
