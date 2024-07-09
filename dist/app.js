"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducer = void 0;
const kafkajs_1 = require("kafkajs");
const uuid_1 = require("uuid");
const writer_config_1 = require("./config/writer.config");
class KafkaProducer {
    constructor() {
        this._producer = null;
        this._isConnected = false;
        this.publish = async (producerInput, logger) => {
            let kafka = KafkaProducer.getInstance();
            if (!kafka.isConnected) {
                await kafka.connect();
            }
            const { topic, message } = producerInput;
            message.payload.uniqueId = (0, uuid_1.v4)();
            message.payload.createdAt = new Date().toISOString();
            try {
                await kafka.producer.send({
                    topic: topic || (0, writer_config_1.getEnvValue)('KAFKA_TOPIC'),
                    messages: [
                        {
                            key: message.eventName,
                            value: JSON.stringify(message.payload),
                        },
                    ],
                });
                logger
                    ? logger.info("writes: ", JSON.stringify(message))
                    : console.log("writes: ", JSON.stringify(message));
            }
            catch (err) {
                logger
                    ? logger.error("could not write message " + err)
                    : console.error("could not write message " + err);
            }
        };
        const kafkaConfig = (0, writer_config_1.getKafkaConfig)();
        const kafka = new kafkajs_1.Kafka(kafkaConfig);
        this._producer = kafka.producer();
    }
    static getInstance() {
        if (!KafkaProducer.instance) {
            KafkaProducer.instance = new KafkaProducer();
        }
        return KafkaProducer.instance;
    }
    get isConnected() {
        return this._isConnected;
    }
    async connect() {
        try {
            const producer = this._producer;
            await producer.connect();
            await producer.on("producer.connect", () => console.info("producer kafka connected"));
            await producer.on("producer.disconnect", () => console.error("producer kafka disconnect"));
            await producer.on("producer.network.request_timeout", () => console.error("producer kafka network timeout"));
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
//# sourceMappingURL=app.js.map