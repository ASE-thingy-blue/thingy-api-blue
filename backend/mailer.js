const nodemailer = require("nodemailer");

let mailer = {};

mailer.mailConfig = {
    sender: {
        from: "'Termon Web Service' <termon@pillo-srv.ch>"
    },
    server: {
        host: "vm-mail.pillo-srv.ch",
        port: 465,
        secure: true,
        tls: {rejectUnauthorized: false},
        auth: {
            user: "termon@pillo-srv.ch",
            pass: ""
        }
    }
};

// Create reusable transporter object using the default SMTP transport
mailer.transporter = nodemailer.createTransport(mailer.mailConfig.server);

/**
 * Send Thingy Info Mail
 * @param to
 * @param subject
 * @param message
 * @param messageHtml
 */
mailer.sendMail = function (to, subject, message, messageHtml) {
    // Setup email data with unicode symbols
    let mailOptions = {
        from: mailer.mailConfig.sender.from,
        to: to,
        subject: subject,
        text: message,
        html: messageHtml
    };
    // Send mail with defined transport object
    mailer.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Message sent: %s", info.messageId);
    });
};

module.exports = {
    sendMail: mailer.sendMail.bind()
};
