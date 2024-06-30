import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"[DAIDEV] - Dai Nguyen 👻" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

export default sendEmail;
