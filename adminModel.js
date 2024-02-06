const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = mongoose.Schema({
    firstname: String,
    email: {
        type: String,
        unique: true, // assuming you want emails to be unique
        required: true // assuming you want emails to be required
    },
    password: String
});

adminSchema.plugin(passportLocalMongoose, { usernameField: 'email' });


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
