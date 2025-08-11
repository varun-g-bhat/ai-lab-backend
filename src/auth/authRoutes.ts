import express from "express";
import {
  changeRole,
  createUser,
  getAllUsers,
  loginUser,
  logoutUser,
  verifyUser,
} from "./authController";
import userValidationRules from "../validator/userValidator";
import validate from "../middleware/validate";

const authRouter = express.Router();

// Authentication Routes
authRouter.post("/signup", userValidationRules(), validate, createUser);
authRouter.post("/login", loginUser);
authRouter.post("/verify", verifyUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/all-users", getAllUsers);
authRouter.post("/change-role", changeRole);

export default authRouter;
