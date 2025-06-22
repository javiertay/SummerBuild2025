import express from "express";
import multer from 'multer';
import {getAll, create, updateStatus, updateInternship, deleteInternship} from "../controllers/internshipController.js";

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
router.post(
  '/internships',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'followUpDate' },
    { name: 'applicationDate' },
    { name: 'status' },
    { name: 'company' },
    { name: 'position' },
    { name: 'comments' },
    { name: 'link' }
  ]),
  create
);

//update status only
route.patch("/:username/internship/:internshipId/status", updateStatus);

//edit internship details
route.patch("/:username/internship/:internshipId", updateInternship)
//delete internship
route.delete("/:username/internship/:internshipId", deleteInternship);

export default route;