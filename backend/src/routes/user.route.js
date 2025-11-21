import { Router } from "express";
import { getAllUsers, getUserById } from "../controller/user.controller.js";
import { authorize } from "../middleware/auth.middleware.js";
import { adminCheck } from "../middleware/admin.middleware.js";


const userRouter = Router();

userRouter.get('/',authorize, adminCheck, getAllUsers);

userRouter.get('/:id',authorize, adminCheck, getUserById);

export default userRouter;