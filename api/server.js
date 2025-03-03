import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import session from "express-session";
import users from './data/users.json' with {type:'json'}
import { UserModel } from "./models/User.js" ;
import authrouter from "./routers/auth.js";
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
app.use(session({
  name: 'token',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
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
// ==========
// App start
// ==========

app.listen(APP_PORT, () => {
  console.log(`App listening at http://${APP_HOSTNAME}:${APP_PORT}`);
});
