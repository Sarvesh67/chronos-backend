var nodemailer = require('nodemailer');
var config = require('../config/config.js');

// console.log(config.apiKeys.sendGrid.password)
var transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.apiKeys.sendGrid.user, // generated ethereal user
      pass: config.apiKeys.sendGrid.password, // generated ethereal password
    },
});
  
var mailOptions = {
    from: 'SarveshShinde64@gmail.com',
    to: 'f20180778@goa.bits-pilani.ac.in',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

module.exports.mail = (mailOptions) => {
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return error;
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

if (require.main == module) {
    this.mail(mailOptions);
}