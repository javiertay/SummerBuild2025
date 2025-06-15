import express from 'express';
import Users from '../models/userModel.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// GET API /users/
router.get('/', async (req, res) => {
    try {
        const users = await Users.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({message: error.message });
    }
});

// API to login user /users/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await Users.findOne({ username });

        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) return res.status(404).json({ message: "Invalid credentials"});

        const token = jwt.sign({ fullName: existingUser.fullName, staffRole: existingUser.staffRole, id: existingUser._id }, 'tempsecret', { expiresIn: "1h" });

        // prevent username n password from being passed over to the frontend storage
        const modifiedUserData = {'fullName': existingUser.fullName, "staffRole": existingUser.staffRole};

        res.status(200).json({ result: modifiedUserData, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
});

// API to register user /users/register
router.post('/register', async (req, res) => {
    const { username, password, fullName, staffRole} = req.body;

    try {
        const existingUser = await Users.findOne({ username });

        if (existingUser) return res.status(404).json({ message: "Username in use by another user" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await Users.create({ username, password: hashedPassword, fullName, staffRole })

        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
});

// UPDATE API /users/:id
router.patch('/:id', async (req, res) => {
    const { id: _id } = req.params;
    const user = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No user with that id");

    const updatedUser = await Users.findByIdAndUpdate(_id, user, { new: true });

    res.json(updatedUser);
});

// DEL API /users/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No user with that id");

    await Users.findByIdAndRemove(id);

    res.json({message: 'User deleted successfully'});
});

export default router;