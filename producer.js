require('dotenv').config();

const express = require('express');
const app = express();

app.use(require('body-parser').json());

const kafka = require('./kafka');
const producer = kafka.producer();

(async () => {
    await producer.connect();

    setInterval(async () => {
        try {
            const _id = Math.random().toString().slice(-10);
            const responses = await producer.send({
                topic: process.env.TOPIC,
                messages: [{
                    key: _id,
                    value: JSON.stringify({
                        _id,
                        from: "hello@aposto.com",
                        to: `${Math.random().toString(16).slice(10)}@example.com`,
                        subject: "Test email from Aposto!",
                        text: "Hello World",
                        html: "<b>Hello World<b>",
                    }),
                }],
            });
    
            console.log('Published message', { responses });
        } catch (error) {
            console.log('Error publishing message', error);
        }
    }, 50);

    app.post('/email', async (req, res) => {
        try {
            const responses = await producer.send({
                topic: process.env.TOPIC,
                messages: [{
                    key: req.body._id,
                    value: JSON.stringify(req.body),
                }],
            });

            console.log('Published message', { responses });
        } catch (error) {
            console.log('Error publishing message', error);
        }

        res.sendStatus(200);
    });

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server listening on port ${process.env.PORT || 3000}`);
    });
})().catch(async (error) => {
    console.error(error);
    await producer.disconnect();
    process.exit(1);
});
