import { IProducerInput } from "./interface/writer.interface";
export declare class KafkaProducer {
    private static instance;
    private _producer;
    private _isConnected;
    private constructor();
    static getInstance(): KafkaProducer;
    get isConnected(): boolean;
    connect(): Promise<void>;
    get producer(): any;
    publish: (producerInput: IProducerInput, logger?: any) => Promise<void>;
}
