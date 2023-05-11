"use strict";
const nodemailer = require("nodemailer");

const successMail = async (userName, userEmail) => {
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
    subject: "Registration Successful",
    text: `Code`,
    html: `
    <h2>Congratulations, <b>${userName}</b> 🎉🎉</h2>
    <br />
    We welcome you to Jobber. Feel free to connect with other users and start
    your new journey.</b>
    <br />
    <br />
    
    <p>We are very glad to have you on board.</p>
    <br />
    <p>For more enquires, feel free to contact us at <a href"/">Jobber</a></p>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

//main().catch(console.error);
module.exports = successMail;
