import express from "express";
import {   Disconnect, Login } from "../controllers/auth.js";


const authrouter = express.Router();

// router.post('/sign-up',SignUpController)
authrouter.post('/login',Login )
authrouter.get('/disconnect',Disconnect)
export default authrouter;
