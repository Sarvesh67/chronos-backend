var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'apikey', // generated ethereal user
      pass: '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', // generated ethereal password
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