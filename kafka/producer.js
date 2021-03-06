require('dotenv').config();

const kafka = require('./kafka');
const producer = kafka.producer();

(async () => {
    await producer.connect();

    let i = 1;

    setInterval(async () => {
        try {
            const _id = Math.random().toString().slice(-10);
            console.time(`produce - ${_id}`)
            await producer.send({
                topic: process.env.TOPIC,
                messages: [{
                    key: _id,
                    value: JSON.stringify({
                        _id,
                        from: "team@aposto.com",
                        to: `success+${i}@simulator.amazonses.com`,
                        subject: "Test email from Aposto!",
                        text: "Hello World",
                        html: "<b>Hello World<b>",
                    }),
                }],
            });
            console.timeEnd(`produce - ${_id}`)
            
            i += 1;
        } catch (error) {
            console.log('Error publishing message', error);
        }
    }, 100);
})().catch(async (error) => {
    console.error(error);
    await producer.disconnect();
    process.exit(1);
});
