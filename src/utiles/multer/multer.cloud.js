



import { set } from "mongoose";
import multer, { diskStorage } from "multer";


export function fileUpload( { allowedType=["image/jpeg" , "image/png"]}={}){

   
const storage = diskStorage({})   //  upload on Temp folder random file name


 const fileFilter = (req,file,cb)=>{

  if(allowedType.includes(file.mimetype) ){

    cb(null , true)
  }else{
    cb(new Error("invalid file type",{cause:400}))
  }
  // cb(null ,true)
}

return  multer({ fileFilter , storage:storage})
 
}









