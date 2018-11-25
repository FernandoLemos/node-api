'user strict'
const config = require('../config');
const sendGrid = require('sendgrid')(config.sendgridkey);

exports.send = async (to, subject, body) => {
    await sendGrid.send({
        to: to,
        from: 'nando14_22@hotmailco',
        subject: subject,
        html: body
    });
}