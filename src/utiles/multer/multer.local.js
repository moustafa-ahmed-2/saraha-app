
import { set } from "mongoose";
import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid/non-secure";
import fs from "fs"


export function fileUpload( {folder, allowedType=["image/jpeg" , "image/png"],  maxSizeMB = 2 }={}){

   
const storage = diskStorage({
     destination: (req,file,cb)=>{
      let dest=`uploads/${req.user._id}/${folder}`
     if(!fs.existsSync(dest)){

       fs.mkdirSync(dest ,  {recursive:true})
     }
     
      cb(null,dest)
     },
  
                      //such as next
    filename:(req,file,cb)=>{
        console.log({file});
        // cb(null , Date.now() + " "  , nanoid({length:2} )  , file.originalname  )
      cb(null, Date.now() + "-" + nanoid(2) + "-" + file.originalname);
   
    }
})


 const fileFilter = (req,file,cb)=>{

  if(allowedType.includes(file.mimetype) ){

    cb(null , true)
  }else{
    cb(new Error("invalid file type",{cause:400}))
  }
  // cb(null ,true)
}

return  multer({ fileFilter , storage:storage ,  limits: { fileSize: maxSizeMB * 1024 * 1024 }, })
 
}

fileUpload()   //obj 




