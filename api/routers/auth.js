import express from "express";
import {    Login } from "../controllers/auth.js";


const authrouter = express.Router();

// router.post('/sign-up',SignUpController)
authrouter.post('/login',Login )
export default authrouter;
