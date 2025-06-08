import User from "../models/user.js";
import Internship from "../models/internship.js";

export const getAll = async (req, res) => {
    try {
        const internships = await Internship.find();
        res.status(200).json(internships);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const create = async (req, res) => {
    try {
        console.log('Request body: ',req.body);
        
        const internshipData = new Internship({
            User: req.user_id,
            ...req.body
        });
        const savedInternship = await internshipData.save()
        res.status(201).json({
            message: "Internship created successfully",
            internship: savedInternship
        });
    } catch (error) {
        console.error("Error creating internship");
        res.status(500).json({
            message: "Failed to create internship",
            error: error.message
        });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const {username, internshipId} = req.params;
        const {status} = req.body;

        if(!status){
            return res.status(400).json({message: "Status is required"});
        }
        
        const internship = await Internship.findById(internshipId);

        if(!internship){
            return res.status(404).json({message: "Internship not found"});
        }
        
        internship.status = status;
        const updatedInternship = await internship.save();

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            internship: updatedInternship
        });
    } catch (error) {
        console.error("Error updating status: ", error);
        res.status(500).json({
            message: "Failed to update status",
            error: error.message
        });
    }
}