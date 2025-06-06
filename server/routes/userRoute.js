import express from "express";
import {create, login, update} from "../controllers/userController.js";
import {registerSchema, loginSchema, updateSchema} from "../middleware/validateLogin.js";
import {validateRequest} from "../middleware/validateRequest.js";
import {checkUserExist} from "../middleware/checkUserExist.js";

const route = express.Router();

// Registration route with validation
route.post("/register", validateRequest(registerSchema), checkUserExist, create);

// Login route with validation
route.post("/login", validateRequest(loginSchema), login);

// Edit route
route.patch("/users/:id", validateRequest(updateSchema), update);

// Delete route


export default route;