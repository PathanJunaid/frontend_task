import express from "express";
import userRoutes from "./user/user.route";
import  authRoutes   from "./common/auth/auth.routes";
import chatRoutes from "./chat/chat.routes";
// routes
const router = express.Router();

router.use("/users", [userRoutes,authRoutes]);
router.use('/users/chat',chatRoutes)
export default router;