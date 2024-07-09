"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvValue = exports.getKafkaConfig = exports.isLikeKafkaConfig = exports.setEnvironment = void 0;
const path_1 = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
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
    /** load environment variables */
    const loggerRootDir = (0, path_1.dirname)((0, path_1.dirname)(__dirname));
    const applicationRootDir = (0, path_1.dirname)((0, path_1.dirname)((0, path_1.dirname)(loggerRootDir)));
    const envFilePath = path_1.default.resolve(applicationRootDir, "environment", ".env");
    console.log({ path: envFilePath });
    dotenv.config({ path: envFilePath });
    console.log({ process: process.env });
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
    if (saslEnvKeys)
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
    console.log({ kfconfig: config });
    if ((0, lodash_1.isEmpty)(config)) {
        (0, exports.setEnvironment)();
    }
    console.log({ kfconfig: config });
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