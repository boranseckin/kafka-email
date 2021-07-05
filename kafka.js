const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'aposto-tester',
    brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],

    // Remove the complexity in logging, for dev purposes
    logCreator: logLevel => ({ namespace, level, label, log }) => { console.log(log.message) }
});

module.exports = kafka;
