require('dotenv').config();

const nodemailer = require('nodemailer');
const aws = require("@aws-sdk/client-ses");

const ses = new aws.SES({
    region: 'eu-central-1'
});

const transporter = nodemailer.createTransport({
    SES: { ses, aws },
    sendingRate: 20,
});

module.exports = transporter;
