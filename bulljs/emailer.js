const Queue = require('bull');
const transporter = require('../transporter');

const queue = new Queue('emailer', 'redis://localhost', {
    limiter: {
        max: 20,
        duration: 1000,
    }
});

(async () => {
    console.log('Emailer queue is initialized.')
    
    await queue.empty();
    
    console.log(await queue.count());
    
    queue.process(async function (job) {
        try {
            const email = job.data;
            console.time(email.to);
            await transporter.sendMail(email);
            console.timeEnd(email.to);
            return Promise.resolve();
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    });
})();

module.exports = queue;
