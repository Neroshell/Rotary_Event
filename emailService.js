const nodemailer = require('nodemailer');
const crypto = require('crypto');

function generateRandomCode(length) {
    const buffer = crypto.randomBytes(length);
    return buffer.toString('hex').slice(0, length);
}

function sendEmail(userEmail) {
    const uniqueCode = generateRandomCode(5);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dummywithnero@gmail.com',
            pass: 'krox wmba ilzk ugmo' // replace with your actual password
        }
    });

    const mailOptions = {
        from: 'dummywithnero@gmail.com',
        to: userEmail,
        subject: 'Your Unique Code for the Event',
        text: `Your unique code is: ${uniqueCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = { sendEmail, generateRandomCode };
