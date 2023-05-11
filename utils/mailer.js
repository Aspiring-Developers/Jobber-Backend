"use strict";
const nodemailer = require("nodemailer");

const mailer = async (userName, userEmail, code) => {
  let transporter = nodemailer.createTransport({
    host: process.env.host,
    port: process.env.port,
    secure: true,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  let info = await transporter.sendMail({
    from: `"Jobber" <${process.env.jobber}>`, // sender address
    to: `${userEmail}`,
    subject: "Verification Code",
    text: `Code`,
    html: `
    <h2>Hi, <b>${userName}</b></h2>
    <br />
    Your verification code is : <b>${code}</b>
    <br />
    
    <small>Code will expire in 15 minutes.</small>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

//main().catch(console.error);
module.exports = mailer;
