/* eslint-disable node/no-unpublished-require */
const nodemailer = require('nodemailer');
const yandex = require('../yandex');

const sendEmail = async (emailOptions) => {
  const { email, subject, message } = emailOptions;
  // 1. create a transporter
  const transporter = nodemailer.createTransport(yandex);

  // 2. define the email options
  const options = {
    from: `skmebel52 <${yandex.auth.user}>`,
    to: email,
    subject: subject,
    text: message,
    //html:
  };

  // 3. send email
  await transporter.sendMail(options);
};

module.exports = sendEmail;
