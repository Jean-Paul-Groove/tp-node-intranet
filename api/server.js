import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/database.js";
import authrouter from "./routers/auth.js";
import cors from 'cors'
import userRouter from "./routers/user.js";
import { auth } from "./middlewares/auth.js";
// ==========
// App initialization
// ==========

dotenv.config();
const { APP_HOSTNAME, APP_PORT, NODE_ENV } = process.env;

const app = express();

connectDB();
// ==========
// App middlewares
// ==========

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({methods:['GET','POST','PUT','DELETE']}))

// ==========
// App routers
// ==========
// app.get('/migrate', async ()=> {
//   const promises = []
// for(const user of users){
//  delete user.id 
//  promises.push(UserModel.create(user))
// }
// await Promise.all(promises)
// console.log("MIGRATION COMPLETE")
// })
app.use(authrouter)
app.use('/users',auth, userRouter)
// ==========
// App start
// ==========

app.listen(APP_PORT, () => {
  console.log(`App listening at http://${APP_HOSTNAME}:${APP_PORT}`);
});
