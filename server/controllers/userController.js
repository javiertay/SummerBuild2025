import User from "../models/user.js"

export const create = async(req, res) => {
    try{
        console.log('Request body:', req.body);
        const userData = new User(req.body);
        const {email} = userData;

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message: "User already exists."});
        }
        const savedUser = await userData.save();
        res.status(201).json({
            success: true,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });
    }catch(error){
        console.error('Error creating user:', error);
        res.status(500).json({error: error.message || "Internal server error" });
    }
}