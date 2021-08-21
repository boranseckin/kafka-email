const emailer = require('./emailer');

(async () => {
    for (let i = 0; i < 10; i += 1) {
        try {
            emailer.add({
                _id: i,
                from: "team@aposto.com",
                to: `success+${i}@simulator.amazonses.com`,
                subject: "Test email from Aposto!",
                text: "Hello World",
                html: "<b>Hello World<b>",
            });
        } catch (error) {
            console.log('Error publishing message', error);
        }
    }
})().catch((err) => {
    console.error(err);
});
