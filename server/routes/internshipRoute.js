import express from "express";
import multer from 'multer';
import {getAll, create, updateStatus, updateInternship, deleteInternship, dismissFollowUp,updateFollowUp} from "../controllers/internshipController.js";


const route = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'application/pdf'){
        cb(null, true);
    }else{
        cb(new Error('Only PDF Files are allowed!'), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 5*1024*1024}
})

//get all internships (home page)
route.get("/", getAll);

//create new internship
route.post("/", upload.single('resume'), create);

//update status only
route.patch("/:username/internship/:internshipId/status", updateStatus);

//edit internship details
route.patch("/:username/internship/:internshipId", updateInternship)
//delete internship
route.delete("/:username/internship/:internshipId", deleteInternship);

// dismiss follow-up 
route.patch("/:internshipId/dismiss-follow-up", dismissFollowUp);
// update follow-up date/status
route.patch("/:internshipId/follow-up", updateFollowUp);

export default route;