export interface ICredentials {
  mechanism: "scram-sha-256" | "scram-sha-512" | "plain";
  username: string;
  password: string;
}

export interface IKafkaConfig {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  credentials?: ICredentials;
}

export interface IProducerInput {
  topic?: string;
  message: IMessage;
}

export interface IMessage {
  eventName: string;
  payload: IPAYLOAD;
}

export interface IPAYLOAD {
  service: string;
  data: {
    [key: string]: any;
    companyCode: string;
  };
  eventName: string;
  uniqueId?: string;
  createdAt?: string;
}
