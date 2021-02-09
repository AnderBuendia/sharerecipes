const nodemailer = require('nodemailer');

const sendEmails = async (email, contentHTML) => {
    const transporter = nodemailer.createTransport({
        host: 'mail.anderb.me',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAILU,
            pass: process.env.EMAILP
        }
    });
  
    const mailOptions = {
        from: "no-reply@anderb.me",
        to: email,
        subject: "Activate your Account",
        html: contentHTML 
    }

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred', error.message);
        } else {
            console.log('Email sent', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    });
};

module.exports = { sendEmails };