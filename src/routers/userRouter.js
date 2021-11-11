import { deleteUser, edit, logout, see } from "../controllers/userController";
import express from "express";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/delete", deleteUser);
userRouter.get("/logout", logout);
userRouter.get("/:id", see);

export default userRouter;
