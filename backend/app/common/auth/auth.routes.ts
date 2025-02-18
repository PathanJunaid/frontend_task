import express  from 'express';
import passport from 'passport';
import * as authController from './auth.controller'
const authRoutes = express.Router()

authRoutes
    .post("/login", passport.authenticate("login", { session: false }),authController.loginUser)
    .post('/logout',authController.logoutUser)


export default authRoutes;