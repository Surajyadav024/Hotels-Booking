// sendMail.js
import nodemailer from "nodemailer";

const sendMail = async (to, subject, text, html) => {
  //console.log("inside sendMail****");

  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Store email in environment variables
        pass: process.env.EMAIL_PASS, // Store password or app-specific password in environment variables
      },
    });

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // Receiver address
      subject, // Email subject
      text, // Plain text body
      html, // HTML body (optional)
    };

    //console.log(mailOptions, "mailOptions***************");

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info.response;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

export default sendMail;
