const nodemailer = require('nodemailer');

// For Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Using Gmail service
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Use App Password, not your regular password
    }
});

// Alternative: For other SMTP servers
// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: process.env.EMAIL_PORT === '465',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

const sendEmail = async (options) => {
    try {
        // Verify connection configuration
        await transporter.verify();
        
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};

module.exports = sendEmail;