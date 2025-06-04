import mongoose from 'mongoose';

const userScehma = mongoose.Schema({
    username: { type: String, required: true }, 
    password: { type: String, required: true },
    fullName: { type: String, required: true }
});

const Users = mongoose.model('Users', userScehma);

export default Users;