import express from "express";
import { create } from "../controllers/userController.js";
import { loginSchema } from "../middleware/validator.js";

const route = express.Router();

// Middleware to validate request body
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        message: error.details[0].message 
      });
    }
    next();
  };
};

// Route with validation
route.post("/register", validateRequest(loginSchema), create);

export default route;