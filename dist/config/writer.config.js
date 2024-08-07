"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvValue = exports.getKafkaConfig = exports.isLikeKafkaConfig = exports.setEnvironment = void 0;
const lodash_1 = require("lodash");
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
];
let config = {};
const setEnvironment = () => {
    config = process.env;
};
exports.setEnvironment = setEnvironment;
const isLikeKafkaConfig = () => {
    const missingConfig = (0, lodash_1.difference)(requiredKafkaEnvKeys, Object.keys(config));
    if (missingConfig.length > 0) {
        throw new Error(`Missing Kafka configurations: ${missingConfig.join(", ")}`);
    }
    const missingSaslConfig = (0, lodash_1.difference)(saslEnvKeys, Object.keys(config));
    if (missingSaslConfig.length < 3 && missingSaslConfig.length > 0) {
        throw new Error(`Missing Kafka Sasl configurations: ${missingSaslConfig.join(", ")}`);
    }
    return true;
};
exports.isLikeKafkaConfig = isLikeKafkaConfig;
const getSaslConfig = () => {
    const { SASL_MECH, KAFKA_USERNAME, KAFKA_PASSWORD } = config;
    if ((0, lodash_1.isNil)(SASL_MECH) || (0, lodash_1.isNil)(KAFKA_USERNAME) || (0, lodash_1.isNil)(KAFKA_PASSWORD)) {
        return undefined;
    }
    return {
        mechanism: SASL_MECH,
        username: KAFKA_USERNAME,
        password: KAFKA_PASSWORD
    };
};
const getKafkaConfig = () => {
    if ((0, lodash_1.isEmpty)(config)) {
        (0, exports.setEnvironment)();
    }
    if ((0, exports.isLikeKafkaConfig)()) {
        const { KAFKA_BROKERS, KAFKA_CLIENT, KAFKA_ENABLE_SSL, } = config;
        return {
            brokers: KAFKA_BROKERS.split(',').map((broker) => broker.trim()),
            clientId: KAFKA_CLIENT,
            ssl: +KAFKA_ENABLE_SSL === 1,
            credentials: getSaslConfig()
        };
    }
};
exports.getKafkaConfig = getKafkaConfig;
const getEnvValue = (env) => {
    return config[env];
};
exports.getEnvValue = getEnvValue;
//# sourceMappingURL=writer.config.js.map