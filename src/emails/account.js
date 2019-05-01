const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* const msg = {
    to: 'chiraggirdhar28@gmail.com',
    from: 'chiraggirdhar28@gmail.com',
    subject: 'test email',
    text: 'asdsad',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
  sgMail.send(msg); */

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'chiraggirdhar28@gmail.com',
    subject: 'new account creation',
    text: `welcome to the app ,${name}. let me know how you get along with the app.`
  });
};

const sendDeleteMail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'chiraggirdhar28@gmail.com',
    subject: 'account deleted successfully from task app',
    text: `Hi ${name},please let us know how we can serve you better in future.`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendDeleteMail
};