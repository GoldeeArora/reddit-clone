"use strict";
import nodemailer from "nodemailer";



// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, text: string) {
  // send mail with defined transport object
  const testAccount = await nodemailer.createTestAccount();
  console.log('testAccount',testAccount)
  const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: to, // list of receivers
    subject: "Change Password", // Subject line
    html: text, // plain text body
  
  });

  console.log("Message sent: %s", info.messageId);
 console.log(nodemailer.getTestMessageUrl(info))
}
// sendEmail().catch((err)=>console.log(err))


