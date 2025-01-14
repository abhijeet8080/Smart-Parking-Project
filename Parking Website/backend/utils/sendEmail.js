const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE, // Corrected typo here
        auth: {
            user: process.env.SMTP_MAIL, // Corrected typo here
            pass: process.env.SMTP_PASSWORD, // Corrected typo here
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL, // Corrected typo here
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
