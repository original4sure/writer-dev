import { Kafka } from "kafkajs";
import { v4 as uuidv4 } from "uuid";

interface IProducerInput {
  topic: string;
  message: IMessage;
}
interface IMessage {
  eventName: string;
  payload: IPAYLOAD;
}
interface IPAYLOAD {
  service: string;
  data: {
    [key: string]: any;
    companyCode: string;
  };
  eventName: string;
  uniqueId?: string;
  createdAt?: string;
}

export enum KAFKA_MECHANISM {
  SCRAM_SHA_256 = "scram-sha-256",
  SCRAM_SHA_512 = "scram-sha-512",
  PLAIN = "plain",
}

interface ICredentials {
  mechanism: KAFKA_MECHANISM;
  username: string;
  password: string;
}

interface IConnection {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  credentials?: ICredentials;
}

export class KafkaProducer {
  private static instance: KafkaProducer;
  private _producer = null;
  private _isConnected = false;

  private constructor(connectionString) {
    const { clientId, brokers, credentials, ssl } = connectionString;
    const kafka = new Kafka({
      clientId,
      brokers,
      ssl: ssl || true,
      sasl: credentials,
    });
    this._producer = kafka.producer();
  }

  public static getInstance(connectionString): KafkaProducer {
    if (!KafkaProducer.instance) {
      KafkaProducer.instance = new KafkaProducer(connectionString);
    }
    return KafkaProducer.instance;
  }

  public get isConnected() {
    return this._isConnected;
  }

  async connect(): Promise<void> {
    try {
      await this._producer.connect();
      const producer = this._producer;
      await this._producer.on("producer.connect", () =>
        console.info("producer kafka connected")
      );
      await this._producer.on("producer.disconnect", () =>
        console.error("producer kafka disconnect")
      );
      await this._producer.on("producer.network.request_timeout", () =>
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
}
export const publish = async (
  connectionString: IConnection,
  producerInput: IProducerInput,
  logger?
) => {
  let kafka = KafkaProducer.getInstance(connectionString);
  if (!kafka.isConnected) {
    await kafka.connect();
  }
  const { topic, message } = producerInput;
  message.payload.uniqueId = uuidv4();
  message.payload.createdAt = new Date().toISOString();
  try {
    await kafka.producer.send({
      topic,
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
