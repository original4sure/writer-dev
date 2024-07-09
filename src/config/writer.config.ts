import path, { dirname } from "path";
import * as dotenv from "dotenv";
import { difference, get, isEmpty, isNil } from "lodash";
import { IKafkaConfig } from "../interface/writer.interface";

const requiredKafkaEnvKeys = [
  "KAFKA_BROKERS",
  "KAFKA_CLIENT",
  "KAFKA_ENABLE_SSL",
	"KAFKA_TOPIC",
];

const saslEnvKeys = [
	"SASL_MECH",
	"KAFKA_USERNAME",
	"KAFKA_PASSWORD",
]

let config: Record<string, any> = {};

export const setEnvironment = () => {
  config = process.env;
};

export const isLikeKafkaConfig = () => {
  const missingConfig = difference(requiredKafkaEnvKeys, Object.keys(config));

  if (missingConfig.length > 0) {
    throw new Error(
      `Missing Kafka configurations: ${missingConfig.join(", ")}`
    );
  }

	const missingSaslConfig = difference(saslEnvKeys, Object.keys(config));

	if(missingSaslConfig.length < 3 && missingSaslConfig.length > 0) {
		throw new Error(
      `Missing Kafka Sasl configurations: ${missingSaslConfig.join(", ")}`
    );
	}

  return true;
};

const getSaslConfig = () => {
  const { SASL_MECH, KAFKA_USERNAME, KAFKA_PASSWORD } = config

  if (isNil(SASL_MECH) || isNil(KAFKA_USERNAME) || isNil(KAFKA_PASSWORD)) {
    return undefined
  }

  return {
    mechanism: SASL_MECH,
    username: KAFKA_USERNAME,
    password: KAFKA_PASSWORD
  }
}

export const getKafkaConfig = (): IKafkaConfig => {
  if (isEmpty(config)) {
    setEnvironment();
  }

  if (isLikeKafkaConfig()) {
    const {
      KAFKA_BROKERS,
      KAFKA_CLIENT,
      KAFKA_ENABLE_SSL,
    } = config;

    return {
        brokers: KAFKA_BROKERS.split(',').map((broker: string) => broker.trim()),
        clientId: KAFKA_CLIENT,
        ssl: +KAFKA_ENABLE_SSL === 1,
        credentials: getSaslConfig()
    }
  }
};

export const getEnvValue = (env: string) => {
	return config[env]
}
