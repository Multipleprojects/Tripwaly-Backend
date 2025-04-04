// emailService.js
const nodemailer = require("nodemailer");
const { Verification_Email_Template} = require("./otpEmailStyling");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "bhattimudassir897@gmail.com",
    pass: "rgdx uhsn nafh deye",
  },
});

async function sendVerificationEmail(verificationCode, email) {
  const emailHtml = Verification_Email_Template.replace("{verificationCode}", verificationCode);

  await transporter.sendMail({
    from: '"Tripwaly Company 👻" <bhattimudassir897@gmail.com>',
    to: email,
    subject: "OTP Code ✔",
    text: `Your verification code is: ${verificationCode}`,
    html: emailHtml,
  });
}

module.exports = sendVerificationEmail;
