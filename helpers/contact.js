import sendEmail from '../utils/sendEmail';

export const sendMailToContact = async (name, email, message) => {
  const subject = 'Regarding Your Recent Inquiry';
  const text = 'Dear ' + name;
  const html = `<html>
    <body>
      <p>Dear ${name},</p>

      <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible. Your feedback is important to us, and we appreciate you taking the time to contact us.</p>
      
      <p>Here are the details of your message:</p>
      
      <p>Message: <b>${message}</b></p>
      
      <p>If you have any further questions or concerns, please feel free to reply to this email. We're here to help!</p>
      
      <p>Best regards,</p>
      <p>Dai Nguyen</p>
    </body>
  </html>`;

  await sendEmail(
    email + ',' + process.env.MY_EMAIL,
    subject,
    text,
    html
  );
};