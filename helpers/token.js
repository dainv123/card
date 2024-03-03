import { ApolloError } from 'apollo-server-express';
import crypto from 'crypto';
import { Token } from '../models/models';
import sendEmail from '../utils/sendEmail';

export const sendEmailWithToken = async (user, action) => {
  await Token.deleteOne({ user: user._id, action });

  const token = await Token.create({
    user: user._id,
    token: crypto.randomBytes(16).toString('hex'),
    action
  });

  const url = process.env.CLIENT_URI + '/verify-token/' + token.token;
  const subject = 'Verify Your Account on DAIDEV';
  const text = 'Dear ' + user.name;
  const html = `<html>
    <body>
      <p>Dear ${user.name},</p>

      <p>Welcome to DAIDEV! We're thrilled to have you join our community.</p>
      
      <p>To complete the signup process and activate your account, please click the link below:</p>
      
      <p><a href="${url}">Verify Your Account</a></p>
      
      <p>By verifying your account, you'll gain access to all the features and benefits DAIDEV has to offer.</p>
      
      <p>If you didn't sign up for an account with us, please disregard this email.</p>
      
      <p>Thank you for choosing DAIDEV. We look forward to seeing you onboard!</p>
      
      <p>Best regards,</p>
      
      <p>Dai Nguyen</p>
    </body>
  </html>`;

  sendEmail(
    user.email,
    subject,
    text,
    html
  );

  return token;
};
export const verifyToken = async (token, action) => {
  const message = 'We were unable to find a valid token. Your token may have expired.';

  const verifiedToken = await Token.findOne({ token, action });

  if (!verifiedToken) {
    throw new ApolloError(message, 'INVALID_TOKEN');
  }

  return verifiedToken;
};
