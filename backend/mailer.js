const Nodemailer = require("nodemailer");

let mailer = {};

mailer.mailConfig = {
    sender: {
        from: "{MAILFROM}"
    },
    server: {
        host: "{MAILHOST}",
        port: 465,
        secure: true,
        tls: {rejectUnauthorized: false},
        auth: {
            user: "{MAILUSER}",
            pass: "{MAILPASS}"
        }
    }
};

// Create reusable transporter object using the default SMTP transport
mailer.transporter = Nodemailer.createTransport(mailer.mailConfig.server);

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
            console.error(error);
            return;
        }
        console.log("Message sent: %s", info.messageId);
    });
};

module.exports = {
    sendMail: mailer.sendMail.bind()
};
