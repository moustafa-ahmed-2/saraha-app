
// import dotenv from "dotenv";
// import path from "path";
// dotenv.config({ path: path.resolve(__dirname, "../config/local.env") });



import { v2 as cloudinary } from "cloudinary";


// console.log("API_KEY:", process.env.API_KEY);
// console.log("API_SECRET:", process.env.API_SECRET);
// console.log("CLOUD_NAME:", process.env.CLOUD_NAME);



cloudinary.config({
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
    cloud_name:process.env.CLOUD_NAME,
})


export async function uploadFile({path,options}){
 return await cloudinary.uploader.upload(path,options)

}

export async function uploadFiles(files,options){

      
    let attachments = []
        // upload into cloud
        for (const file of files) {
       const {secure_url , public_id} = await  uploadFile({
        path:file.path,
        options
       })
            attachments.push({secure_url,public_id})
        } 
return attachments    

}


export async function delteFolder(path){
  await  cloudinary.api.delete_resources_by_prefix( path);
  await  cloudinary.api.delete_folder(path)
}



export default cloudinary



