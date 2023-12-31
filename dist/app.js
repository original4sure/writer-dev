"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = exports.KafkaProducer = void 0;
const kafkajs_1 = require("kafkajs");
const uuid_1 = require("uuid");
class KafkaProducer {
    constructor(connectionString) {
        this._producer = null;
        this._isConnected = false;
        const { clientId, brokers, credentials } = connectionString;
        const kafka = new kafkajs_1.Kafka({ clientId, brokers,
            ssl: true,
            sasl: {
                mechanism: credentials.mechanism,
                username: credentials.username,
                password: credentials.password
            } });
        this._producer = kafka.producer();
    }
    static getInstance(connectionString) {
        if (!KafkaProducer.instance) {
            KafkaProducer.instance = new KafkaProducer(connectionString);
        }
        return KafkaProducer.instance;
    }
    get isConnected() {
        return this._isConnected;
    }
    async connect() {
        try {
            await this._producer.connect();
            const producer = this._producer;
            await this._producer.on('producer.connect', () => console.info('producer kafka connected'));
            await this._producer.on('producer.disconnect', () => console.error('producer kafka disconnect'));
            await this._producer.on('producer.network.request_timeout', () => console.error('producer kafka network timeout'));
            this._isConnected = true;
        }
        catch (err) {
            console.error(err);
        }
    }
    get producer() {
        return this._producer;
    }
}
exports.KafkaProducer = KafkaProducer;
const publish = async (connectionString, producerInput, logger) => {
    let kafka = KafkaProducer.getInstance(connectionString);
    if (!kafka.isConnected) {
        await kafka.connect();
    }
    const { topic, message } = producerInput;
    message.payload.uniqueId = (0, uuid_1.v4)();
    message.payload.createdAt = new Date().toISOString();
    try {
        await kafka.producer.send({
            topic,
            messages: [
                {
                    key: message.eventName,
                    value: JSON.stringify(message.payload)
                },
            ],
        });
        logger ? logger.info("writes: ", JSON.stringify(message)) : console.log("writes: ", JSON.stringify(message));
    }
    catch (err) {
        logger ? logger.error("could not write message " + err) : console.error("could not write message " + err);
    }
};
exports.publish = publish;
//# sourceMappingURL=app.js.map