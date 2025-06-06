import express from "express";
import User from "../models/user.js";
import {create, login, update, remove} from "../controllers/userController.js";
import {registerSchema, loginSchema, updateSchema} from "../middleware/validateLogin.js";
import {validateRequest} from "../middleware/validateRequest.js";
import {checkUserExist} from "../middleware/checkUserExist.js";

const route = express.Router();

// Registration route with validation
route.post("/register", validateRequest(registerSchema), checkUserExist, create);

// Login route with validation
route.post("/login", validateRequest(loginSchema), login);

// Edit route
route.patch("/:username", validateRequest(updateSchema), update);

// Delete route
route.delete("/:username", remove);

export default route;