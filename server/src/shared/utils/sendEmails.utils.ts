import nodemailer from 'nodemailer';
import { SendEmails } from '@Shared/rest/interfaces/send-emails.interface';
import { USER_EMAIL, USER_PASS } from '@Shared/utils/constants';

export const sendEmails = ({ email, mailContent }: SendEmails) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false,
    auth: {
      user: USER_EMAIL,
      pass: USER_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: 'no-reply@anderb.info',
    to: email,
    subject: `${mailContent.text}`,
    html: `<div style="width:100%">
            <h1 style="text-align:center">ShareRecipes</h1>
             <div style="text-align:left">
              <h2>${mailContent.text}</h2>
                <a 
                  style="font-weight:bold; padding: 10px; background: green; 
                  color: white; border-radius: 20px; text-decoration: none;"
                  href=${mailContent.url}
                >
                  ${mailContent.text}
                </a>
              </div>
              <div style="width:75%; border:1px solid grey; margin-top: 20px"></div>
              <div>
                <p style="font-weight:bold;">You can redirect through this link</p>
                <p>${mailContent.url}</p>
              </div>
            </div>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred', error.message);
    } else {
      console.log('Email sent', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  });
};
