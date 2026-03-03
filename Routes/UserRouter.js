import express from "express";
import {
  registerUser,
  verifyuer,
  login,
  forgotpassword,
  resetpassword,
  editprofile,
  editpassword,
  resendCode,
} from "../Controllers/UserController.js";
import { createConsultation } from "../Controllers/ConsultationController.js";
import { getEvents } from "../Controllers/EventController.js";

import authUser from "../Middleware/Authuser.js";

import upload from "../Middleware/Multer.js";

const UserRouter = express.Router();

/* ===== PUBLIC ROUTES ===== */
UserRouter.post("/register", upload.single("image"), registerUser);
UserRouter.post("/verify", verifyuer);
UserRouter.post("/login", login);
UserRouter.post("/forgot-password", forgotpassword);
UserRouter.post("/reset-password", resetpassword);
UserRouter.post("/resend-code", resendCode);
UserRouter.post("/consultation", createConsultation);
UserRouter.get("/events", getEvents);

/* ===== PROTECTED ROUTES ===== */
UserRouter.put("/edit-profile", authUser, upload.single("image"), editprofile);
UserRouter.put("/edit-password", authUser, editpassword);

export default UserRouter;

