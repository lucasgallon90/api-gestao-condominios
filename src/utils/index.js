const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

module.exports = class Utils {
  static LIMIT = 1000;
  static async randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }
  static groupByKey(array, key) {
    return array.reduce((hash, obj) => {
      if (obj[key] === undefined) return hash;
      return Object.assign(hash, {
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      });
    }, {});
  }
  static enviarEmail(mailOptions) {
    const options = {
      service: process.env.NODE_MAILER_SERVICE || undefined,
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASS,
      },
      host: process.env.NODE_MAILER_HOST || undefined,
      port: process.env.NODE_MAILER_PORT || undefined,
      secure: process.env.NODE_MAILER_SECURE || false,
    };
    const transporter = nodemailer.createTransport(options);
    return transporter.sendMail(mailOptions);
  }
};
