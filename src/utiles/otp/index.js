

/**
 * 
 * @param {*} expireTime 
 * @returns  object {otp , otpExpire}
 */




export const generateoTP =(expireTime = 15*60*1000)=>{


const otp = Math.floor(Math.random() * 90000 + 10000  )  // generate otp
const otpExpire = Date.now() +  expireTime
return {otp , otpExpire};


}



