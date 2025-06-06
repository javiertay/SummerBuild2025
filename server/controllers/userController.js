import User from "../models/user.js"

export const create = async(req, res) => {
    try{
        console.log('Request body:', req.body);
        const userData = new User(req.body);
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
        res.status(500).json({success: false, message: "Internal server error" });
    }
}

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }
        
        // Compare passwords
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid password" 
            });
        }
        // User authenticated successfully
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message || "Internal server error" 
        });
    }
}

export const update = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, currentPassword, newPassword } = req.body;
        
        // Find the user
        const user = await User.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Create updates object
        const updates = {};
        
        // Handle username update if provided
        if (username && username !== user.username) {
            // Check if username is already taken
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({
                    success: false,
                    message: "Username already taken"
                });
            }
            updates.username = username;
        }
        
        // Handle email update if provided
        if (email && email !== user.email) {
            // Check if email is already taken
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use"
                });
            }
            updates.email = email;
        }
        
        // Handle password update if provided
        if (newPassword && currentPassword) {
            // Verify current password
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect"
                });
            }
            updates.password = newPassword;
        }
        
        // If there are no updates, return early
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid updates provided"
            });
        }
        
        // Apply updates
        Object.assign(user, updates);
        await user.save(); // Using save() triggers password hashing middleware
        
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}