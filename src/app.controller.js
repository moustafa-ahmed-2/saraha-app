import { error } from "console"
import { connectDB } from "./DB/connection.js"
import {rateLimit} from "express-rate-limit"
import authRouter from "./modules/auth/auth.controller.js"
import messageRouter from "./modules/message/message.controller.js"
import userRouter from "./modules/user/user.controller.js"
import cors from "cors"
import fs from "fs"
import { globalErrorhandler } from "./utiles/Error/index.js"


export function bootstrap(app,express){

const limiter = rateLimit({
  windowMs:15*60 * 1000,
  limit:20,
  handler:(req,res,next,options)=>{
    throw new Error(options.message,{cause:400})
  },
  identifier:(req,res,next)=>{
    return req.ip
  }

})
app.use(limiter)

    app.use(express.json())
   app.use( "/uploads" ,   express.static("uploads"))

  app.use(cors({
    origin:"*"  // http://localhost:5173/
  }))


app.use("/auth",authRouter)
app.use("/message" , messageRouter )
app.use("/user" , userRouter)



app.use(globalErrorhandler)



connectDB()



}

