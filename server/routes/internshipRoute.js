import express from "express";
import {getAll, create, updateStatus, updateInternship, deleteInternship} from "../controllers/internshipController.js";

const route = express.Router();

//get all internships (home page)
route.get("/", getAll);

//create new internship
route.post("/", create);

//update status only
route.patch("/:username/internship/:internshipId/status", updateStatus);

//edit internship details
route.patch("/:username/internship/:internshipId", updateInternship)
//delete internship
route.delete("/:username/internship/:internshipId", deleteInternship);

export default route;