const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ['Dr', 'HRM', 'Otunba', 'High Chief', 'Chief', 'Mr', 'Mrs', 'Miss', 'Sir', 'Engr', 'Alhaji', 'Pastor', 'ARC']
    },
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    calname: String,
    clubname: String,
    phonenumber: String, // Changed to String type
    eventCode: String,
    count: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
