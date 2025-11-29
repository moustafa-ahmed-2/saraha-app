


// export const isValid = (scema)=> {


// return(req , res , next)=> {
    

// const {value , error}  =scema.validate(req.body ,  {abortEarly:false} );
// if(error){
//    let errorMessage =  error.details.map((err)=>err.message )
//    console.log(errorMessage);
   
//    errorMessage = errorMessage.join(", ");
   
//    throw new Error(errorMessage ,  {cause:40} )

// }   

// next();
// }

    
// }







import joi  from "joi"


export const isValid = (schema) => {
  return (req, res, next) => {
    let data  ={...req.body,...req.params,...req.query }
    const { value, error } = schema.validate(data, { abortEarly: false });

    if (error) {
      let errorMessage = error.details.map((err) => err.message).join(", ");
      console.log(errorMessage);
      return res.status(400).json({ success: false, message: errorMessage });
    }

    next(); 
  };
};




export const generateFields={
email:joi.string().email({tlds:{allow:["com"]}}),
phoneNumber:joi.string().length(11),
password:joi.string().min(8),
name:joi.string().min(3).max(30),
dob:joi.date(),
otp:joi.string().length(5),
rePassword:(ref)=> joi.string().min(8).valid(joi.ref(ref)),
objectId:joi.string().hex().length(24)


}