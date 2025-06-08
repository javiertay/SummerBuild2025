import express from "express";
import {getAll, create, updateStatus} from "../controllers/internshipController.js";

const route = express.Router();

//get all internships (home page)
route.get("/home", getAll);

//create new internship
route.post("/createInternship", create);

//update status only
route.patch("/:username/internship/:internshipId/status", updateStatus);
//edit internship details

//delete internship
