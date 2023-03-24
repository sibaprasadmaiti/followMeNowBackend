const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email for user password
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise}
 */
const sendMailForUserPassword = async (email, password, name) => {
  const mailSubject = `Your Temporary Password`;
  const mailTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" style="padding: 40px;" height="200"><p>Hi ${name} ,</p><p>Your temporary password is: <b>${password}</b>.</p></td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2022 Follow Now All rights reserved</p></td></tr></table></td></tr></table></body></html>`;
  const msg = { from: config.email.from, to: email, subject: mailSubject, html: mailTemplate };
  await transport.sendMail(msg);
};

/**
 * Send an email for user password
 * @param {string} email
 * @param {string} forgotUrl
 * @returns {Promise}
 */
const sendMailForForgotPassword = async (email, forgotUrl) => {
  const mailSubject = `Followme Now password reset`;
  const mailTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" style="padding: 40px;" height="200"><h3><b>To reset your Followme Now password, please click this link: </b></h3><p>${forgotUrl}</p></td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2022 Follow Now All rights reserved</p></td></tr></table></td></tr></table></body></html>`;
  const msg = { from: config.email.from, to: email, subject: mailSubject, html: mailTemplate };
  await transport.sendMail(msg);
};

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendMailForUserPassword,
  sendMailForForgotPassword,
  sendEmail,
  sendResetPasswordEmail,
};
