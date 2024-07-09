import { IKafkaConfig } from "../interface/writer.interface";
export declare const setEnvironment: () => void;
export declare const isLikeKafkaConfig: () => boolean;
export declare const getKafkaConfig: () => IKafkaConfig;
export declare const getEnvValue: (env: string) => any;
