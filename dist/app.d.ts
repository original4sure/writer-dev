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
interface IConnection {
    clientId: string;
    brokers: string[];
    ssl: boolean;
    credentials?: {
        mechanism: 'scram-sha-256' | 'scram-sha-512' | 'plain';
        username: string;
        password: string;
    };
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
