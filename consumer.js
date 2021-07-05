require('dotenv').config();

const nodemailer = require('nodemailer');
const Kafka = require('./kafka');

const consumer = Kafka.consumer({ groupId: process.env.GROUP_ID });

(async () => {
    await consumer.connect();

    await consumer.subscribe({
        topic: process.env.TOPIC,
        fromBeginning: true,
    });

    const { user, pass } = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user, pass },
        pool: true,
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const email = JSON.parse(message.value);
                const info = await transporter.sendMail(email);
                console.log(`Message sent: ${info.messageId}`);
                console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            } catch (error) {
                console.error(error);
            }
        },
    });

    process.on('SIGINT', async () => {
        try {
            await consumer.disconnect();
        } catch (e) {
            console.error('Failed to gracefully disconnect consumer', e);
        }

        process.exit(0);
    })
})().catch(async (error) => {
    console.error(error.message);

    try {
        await consumer.disconnect();
    } catch (e) {
        console.error('Failed to gracefully disconnect consumer', e);
    }

    process.exit(1);
});
