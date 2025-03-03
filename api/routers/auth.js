import express from "express";
import {   LoginController } from "../controllers/auth.js";


const authrouter = express.Router();

// router.post('/sign-up',SignUpController)
authrouter.post('/login',LoginController )
export default authrouter;
