import express from "express";
import { Create, Delete, GetUser, GetCurrentUser, GetRandomUser, SearchUsers, Update } from "../controllers/user.js";
import { canEdit } from "../middlewares/canEdit.js";
import { isAdmin } from "../middlewares/isAdmin.js";


const userRouter = express.Router();
// CHECK ADMIN FOR DELETE AND CREATE
// CHECK PERMISSIONS FOR UPDATE 
userRouter.get('/current', GetCurrentUser)
userRouter.get('/random',GetRandomUser)
userRouter.get('/:id', GetUser)
userRouter.put('/:id',canEdit, Update)
userRouter.post('/search', SearchUsers)
userRouter.post('/',isAdmin, Create)
userRouter.delete('/:id', isAdmin,Delete)
export default userRouter;
