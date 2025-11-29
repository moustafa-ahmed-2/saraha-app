
import { Message } from "../../DB/model/message.model.js";
import cloudinary, { uploadFiles } from "../../utiles/cloud/cloudinary.config.js";




export const sendMessage = async(req,res,next)=>{

  try {

    const {content} = req.body;
    const {receiver} = req.params
    const {files} = req;

// const attachments =   await uploadFiles({files,options:{
//     files,
//     options:{folder:`c44-saraha/users/${receiver}/messages`}
// }})

const cleanReceiver = receiver.trim();
const attachments = await uploadFiles(
  files,
  { folder:`c44-saraha/users/${cleanReceiver}/messages` }
);




await Message.create({
    content,
    receiver:cleanReceiver,
    attachments,
    sender:req.user?._id
})

return res.status(201).json({
    message:"message sent successfully",
    success:true
})


  } catch (err) {
    next(err); 
  }



}





export const getmessage =async (req,res,next)=> {

  let {id} = req.params;
      id = id.trim();
const message =  await Message.findOne(
  {_id:id,receiver:req.user._id}).populate("receiver", "-password -credentialUpdatedAt");
  // {},
  // {populate:[{path:"receiver",select:"-password -credentialUpdatedAt"}]}
; 

if(!message){
  throw new Error("message not found",{cause:404})
}
return res.status(200).json({message:"done",success:true,data:{message}})

}




