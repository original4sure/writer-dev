import { Kafka } from "kafkajs";
import { v4 as uuidv4 } from "uuid";
import { getEnvValue, getKafkaConfig } from "./config/writer.config";
import { IProducerInput } from "./interface/writer.interface";

export class KafkaProducer {
  private static instance: KafkaProducer;
  private _producer = null;
  private _isConnected = false;

  private constructor() {
    const kafkaConfig = getKafkaConfig();
    const kafka = new Kafka(kafkaConfig);
    this._producer = kafka.producer();
  }

  public static getInstance(): KafkaProducer {
    if (!KafkaProducer.instance) {
      KafkaProducer.instance = new KafkaProducer();
    }
    return KafkaProducer.instance;
  }

  public get isConnected() {
    return this._isConnected;
  }

  async connect(): Promise<void> {
    try {
      const producer = this._producer;
      await producer.connect();
      await producer.on("producer.connect", () =>
        console.info("producer kafka connected")
      );
      await producer.on("producer.disconnect", () =>
        console.error("producer kafka disconnect")
      );
      await producer.on("producer.network.request_timeout", () =>
        console.error("producer kafka network timeout")
      );
      this._isConnected = true;
    } catch (err) {
      console.error(err);
    }
  }

  get producer() {
    return this._producer;
  }

  publish = async (
    producerInput: IProducerInput,
    logger?
  ) => {
    let kafka = KafkaProducer.getInstance()
    if (!kafka.isConnected) {
      await kafka.connect();
    }
    const { topic, message } = producerInput;
    message.payload.uniqueId = uuidv4();
    message.payload.createdAt = new Date().toISOString();
    try {
      await kafka.producer.send({
        topic: topic || getEnvValue('KAFKA_TOPIC'),
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
    } catch (err) {
      logger
        ? logger.error("could not write message " + err)
        : console.error("could not write message " + err);
    }
  };
}
