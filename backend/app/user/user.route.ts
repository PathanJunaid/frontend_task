
import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import { authverify } from "../common/auth/auth.controller";

const router = Router();

router
        .get("/", authverify, userController.getAllUser)
        .get("/:id",authverify, userController.getUserById)
        .delete("/:id", userController.deleteUser)
        .post("/", userValidator.createUser, catchError, userController.createUser)

export default router;

