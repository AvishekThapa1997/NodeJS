const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.sendMail = (mail) => {
  return transporter.sendMail(mail);
};
