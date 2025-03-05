import express from "express";
import { Create, Delete, Get, GetCurrent, GetRandom, SearchUsers, Update } from "../controllers/user.js";
import { canEdit } from "../middlewares/canEdit.js";
import { isAdmin } from "../middlewares/isAdmin.js";


const userRouter = express.Router();

userRouter.get('/current', GetCurrent)
userRouter.get('/random',GetRandom)
userRouter.get('/:id', Get)
userRouter.put('/:id',canEdit, Update)
userRouter.post('/search', SearchUsers)
userRouter.post('/',isAdmin, Create)
userRouter.delete('/:id', isAdmin,Delete)
export default userRouter;
