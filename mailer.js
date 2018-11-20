'use strict';


const nodemailer= require('nodemailer');

var sendMailService = ()=> {
// create reusable transport method (opens pool of SMTP connections)
var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        username: "customersuppot23@gmail.com",
        password: "Support@123"
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: email, // sender address
    to: "capstorelausanne@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
}

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    transporter.close(); // shut down the connection pool, no more messages
});

}



module.exports = {
    sendMailService,

};
