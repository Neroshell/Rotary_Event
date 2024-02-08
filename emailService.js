const nodemailer = require('nodemailer');
const crypto = require('crypto');

function generateRandomCode(length) {
    const buffer = crypto.randomBytes(length);
    return buffer.toString('hex').slice(0, length);
}

function sendEmail(userEmail, uniqueCode) {
   

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
        html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
           
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color:  #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .code {
            text-align: center;
            font-size: 24px;
            margin-bottom: 30px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
        }
        strong {
            font-size: 35px;
            color: #F7A81B;
        }
       
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h2>Confirmation of Your Code for Event Access</h2>
        </div>
        <div class="code">
          
            <p>Your unique code is <br> <br> <strong>${uniqueCode}</strong></p>
            <p>This code will be used throughout the event.</p>
        </div>
        <div class="footer">
            <p>Best Regards,<br>Nero<br>The CEO</p>
            <hr>
            <p>Rotary club, district 9111</p>
        </div>
    </div>
</body>
</html>

    `
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
