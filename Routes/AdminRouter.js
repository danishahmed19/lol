import express from "express";
import { getAllUsers, toggleUserStatus } from "../Controllers/AdminController.js";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../Controllers/CategoryController.js";
import { getConsultations } from "../Controllers/ConsultationController.js";
import { createEvent, getEvents, updateEvent, deleteEvent } from "../Controllers/EventController.js";
import authUser from "../Middleware/Authuser.js";
import adminAuth from "../Middleware/AdminMiddleware.js";
import upload from "../Middleware/Multer.js";

const AdminRouter = express.Router();

// Temporarily disabled protection for testing as requested
// AdminRouter.use(authUser, adminAuth);

// User Management Routes
AdminRouter.get("/users", getAllUsers);
AdminRouter.patch("/users/:id/status", toggleUserStatus);

// Category Management Routes
AdminRouter.post("/categories", createCategory);
AdminRouter.get("/categories", getCategories);
AdminRouter.put("/categories/:id", updateCategory);
AdminRouter.delete("/categories/:id", deleteCategory);

// Consultation Management Routes
AdminRouter.get("/consultations", getConsultations);

// Event Management Routes
AdminRouter.post("/events", upload.array("images", 5), createEvent);
AdminRouter.get("/events", getEvents);
AdminRouter.put("/events/:id", upload.array("images", 5), updateEvent);
AdminRouter.delete("/events/:id", deleteEvent);

export default AdminRouter;

