require('dotenv').config();

const Kafka = require('./kafka');
const transporter = require('../transporter');

const consumer = Kafka.consumer({ groupId: process.env.GROUP_ID });

(async () => {
    await consumer.connect();

    await consumer.subscribe({
        topic: process.env.TOPIC,
        fromBeginning: true,
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const email = JSON.parse(message.value);
                console.time(`${email.to}`);
                await transporter.sendMail(email);
                console.timeEnd(`${email.to}`);
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
