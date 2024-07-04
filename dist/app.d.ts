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
export declare enum KAFKA_MECHANISM {
    SCRAM_SHA_256 = "scram-sha-256",
    SCRAM_SHA_512 = "scram-sha-512",
    PLAIN = "plain"
}
export interface ICredentials {
    mechanism: KAFKA_MECHANISM;
    username: string;
    password: string;
}
interface IConnection {
    clientId: string;
    brokers: string[];
    ssl: boolean;
    credentials?: ICredentials;
}
export declare class KafkaProducer {
    private static instance;
    private _producer;
    private _isConnected;
    private constructor();
    static getInstance(connectionString: any): KafkaProducer;
    get isConnected(): boolean;
    connect(): Promise<void>;
    get producer(): any;
}
export declare const publish: (connectionString: IConnection, producerInput: IProducerInput, logger?: any) => Promise<void>;
export {};
