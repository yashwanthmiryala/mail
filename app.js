const express = require("express");
const bodyParser = require('body-parser');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');


/** Initialize express */
const app = express();
/** Set port number */
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

/** Basic route */
app.get("/", (req, res) => {
    res.send("Hello, Welcome to Node.js Development");
});

app.post("/sendMail", (req, res) => {
    const mails = req.body.userData;
    const toMails = [];
    const bccMails = [];
    const ccMails = [];
    mails.forEach(mail => {
        if (mail.type) {
            if (mail.type === 'to') {
                toMails.push(mail.email)
            } else if (mail.type === 'bcc') {
                bccMails.push(mail.email)
            } else if (mail.type === 'cc') {
                ccMails.push(mail.email)
            }
        }
    });
    const msg = {
        to: toMails,
        cc: bccMails,
        bcc: ccMails,
        from: 'praveenk.kasireddy@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        html: req.body.emailMessage,
        attachments: req.body.attachments
    };
    sgMail.send(msg).then(() => {
        let response = {
            status: 200,
            message: 'Email sent successfully',
            data: {
                success: [...toMails, ...bccMails, ...ccMails]
            }
        }
        res.json(response);
    }).catch((error) => {
        res.status(500).json({ message: 'Something went wrong', data: {} });
    });
});

/** Start server */
app.listen(port, () => {
    console.log(`Server running successfully in the Port: ${port}`);
});