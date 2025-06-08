import User from "../models/user.js";
import Internship from "../models/internship.js";

export const create = async (req, res) => {
    try {
        console.log('Request body: ',req.body);
        
        const internshipData = new Internship({
            user: req.user_id,
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