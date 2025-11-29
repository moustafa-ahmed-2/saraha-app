import { model, Schema } from "mongoose";
import { type } from "os";




const schema = new Schema({

// validation
firstName:{
    type:String,
    required:true,
    lowerCase:true,
    trim:true

} ,

lastName:{
     type:String,
    required:true,
    lowerCase:true,
    trim:true
}
,
password:{

    type:String,
    required:function(){
        if(this.userAgent=="google"){
            return false
        }else{
            return true
        }
    },
    lowerCase:true,
    trim:true
}
,




email:{

unique:true,
  type:String,
    lowerCase:true,
    trim:true,
    required:function(){
        if(this.phoneNumber){
            return false
        }
        return true
    }

}
,

phoneNumber:
{
type:String,
required:function(){
if(this.email){
    return false
}
return true


}



},
dob:{
    type:Date
},
isVerified:{
    type:Boolean,
    default:false
},

otp:{
    type:Number
},
otpExpire:{
    type:Date
},
userAgent:{
    type:String,
    enum:["local","google"],
    default:"local"
},
// case cloud
profilePic:{
   secure_url:String,
   public_id:String
},
credentialUpdatedAt:{

    type:Date,
    default:Date.now()

},

deletedAt:{
    type:Date
}




}




 , 



{
    timestamps:true,
    toJSON:{
        virtuals:true
    }
    ,toObject:{
        virtuals:true
    }
}



)





// getter
schema.virtual("fullName").get(function(){

return `${this.firstName} ${this.lastName}`


})


// setter
schema.virtual("fullName").set(function(value){

const [firstName , lastName] = value.split(" ")
this.firstName = firstName
this.lastName = lastName

})


schema.virtual("age").get(function(){
      // current Date
return new Date().getFullYear() -
new Date(this.dob).getFullYear()


})

schema.virtual("messages",{
    ref:"Message",
    localField:"_id",
    foreignField:"receiver"
})



export const User = model("User" , schema)

