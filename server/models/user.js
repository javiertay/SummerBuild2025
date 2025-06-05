const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: [3, 'Username must be at least 3 characters.'],
        maxlength: [20, 'Username cannot exceed 20 characters']
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email']
    },
    password:{
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters.'],
        maxlength: [15, 'Password cannot exceed 15 characters.'],
        select: false
    }
}, {
    timestamps: true
});

//Hash password before saving
userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//Compare password methods
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);