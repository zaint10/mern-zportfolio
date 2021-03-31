const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(from) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  
  let smtpTransport = await nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: process.env.PRODUCTION == 'true',
    requireTLS: false,
      
      auth: {
          user: process.env.MY_DUMMY_EMAIL_ADDRESS,
          pass: process.env.MY_DUMMY_EMAIL_ACC_PASS
      }
  });


  // send mail with defined transport object
  let info = await smtpTransport.sendMail({
    from: `"Z-Portfolio 👻" <${process.env.MY_DUMMY_EMAIL_ADDRESS}>`, // sender address
    to: process.env.MY_PERSONAL_EMAIL_ADDRESS, // list of receivers
    cc:from.email,
    subject: `Hello, This is your response. ✔`, // Subject line
    text: from.msg, // plain text body
    
  });
  info = await smtpTransport.sendMail({
    from: `"${process.env.MY_DUMMY_EMAIL_NAME} 👻" <${process.env.MY_DUMMY_EMAIL_ADDRESS}>`, // sender address
    to: from.email, // list of receivers
    subject: `Hello, ${from.name}. Thanks for reaching out (${process.env.MY_DUMMY_EMAIL_NAME}) ✔`, // Subject line
    text: `Hi ${from.name},\n\nThanks for reaching out to me. I'll get back to you in a day.\n\nThanks and Regards.`, // plain text body
    
  });

}

module.exports = sendEmail