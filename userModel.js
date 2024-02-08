const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true, // assuming you want emails to be unique
        required: true // assuming you want emails to be required
        
    },
    eventCode: String,
    count: {
        type: Number,
        default: 0, // Set the default value to 0
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


