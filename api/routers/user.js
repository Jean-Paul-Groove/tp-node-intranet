import express from "express";
import { GetCurrent } from "../controllers/user.js";
import { auth } from "../middlewares/auth.js";


const userRouter = express.Router();

userRouter.get('/current', GetCurrent)
userRouter.get('/all')
userRouter.get('/random',)
userRouter.get('/:id')
export default userRouter;
