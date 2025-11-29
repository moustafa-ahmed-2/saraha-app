

import express from "express"
import { bootstrap } from "./app.controller.js";
import { User } from "./DB/model/user.model.js";
import schedule from "node-schedule"
import { delteFolder } from "./utiles/cloud/cloudinary.config.js";
import { Message } from "./DB/model/message.model.js";

    //                      D  M w
schedule.scheduleJob("10 52 7 * * *", async () => {
    const users = await User.find({deletedAt: {$lte: Date.now() - 3 * 30 * 24 * 24 * 60 * 1000}})
   
for (const user of users) {
    if (user.profilePic.public_id) {
        await delteFolder(`c44-saraha/users/${user._id}`)
    }
 await User.deleteMany({deletedAt: {$lte: Date.now() -  3 * 30 * 24 * 24 * 60 * 1000}})

await Message.deleteMany({
    receiver:{$in:users.map((user)=>user._id)}
})


}

})




const app = express();


const port = process.env.PORT 


bootstrap(app,express)


app.listen(port,()=>{

    console.log("app is running at port " ,port);
    



})




