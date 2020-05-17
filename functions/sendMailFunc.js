const key = "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"
const sgMail = require('@sendgrid/mail')
console.log(key); 
sgMail.setApiKey(key)
 
const sendEmail = async (email) => {
    console.log(email.to);
    sgMail.send({
        to : 'SarvesShinde64@gmail.com',
        from : 'me@sarvesh.in',
        subject : email.subject,
        text : `name : ${email.body.name}
                email : ${email.body.email}
                subject : ${email.body.subject}
                message : ${email.body.message}`
    }).then(() => {
        console.log('Email sent')
    }).catch(err => {
        console.log(err);
    });
}
 
module.exports = {
    sendEmail
}

if (require.main == module) {
    email = {
        to: 'SarveshShinde64@gmail.com',
        from: 'me@SarveshShinde.in',
        subject: 'Test',
        body: {
            name: 'Test',
            email: 'Test email',
            subject: 'Test Subject',
            message: 'Test Message'
        }
    }
    sendEmail(email);
}