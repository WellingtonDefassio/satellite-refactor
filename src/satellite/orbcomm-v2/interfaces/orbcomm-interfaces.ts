export interface ResponseDownloadMessage {
  ErrorID: number;
  NextStartUTC: string;
  Messages: DownloadMessage[];
}

export interface DownloadMessage {
  ID: number;
  MessageUTC: string;
  ReceiveUTC: string;
  SIN: number;
  MobileID: string;
  RawPayload: number[];
  Payload?: DownloadPayload;
  RegionName: string;
  OTAMessageSize: number;
  CustomerID: number;
  Transport: number;
  MobileOwnerID: number;
}

interface DownloadPayload {
  Name: string;
  SIN: number;
  MIN: number;
  Fields: { Name: string; Value: string }[];
}

export interface MessageBodyPost {
  access_id: string;
  password: string;
  messages: MessagesPost[];
}

export enum OrbcommStatusMap {
  SUBMITTED = 0,
  RECEIVED = 1,
  ERROR = 2,
  DELIVERY_FAILED = 3,
  TIMEOUT = 4,
  CANCELLED = 5,
  WAITING = 6,
  INVALID = 7,
  TRANSMITTED = 8,
}

export enum OrbcommMessageStatus {
  SUBMITTED = 'SUBMITTED',
  RECEIVED = 'RECEIVED',
  ERROR = 'ERROR',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED',
  WAITING = 'WAITING',
  INVALID = 'INVALID',
  TRANSMITTED = 'TRANSMITTED',
}

interface MessagesPost {
  DestinationID: string;
  UserMessageID: number;
  RawPayload: number[];
}
export interface SubmitResponse {
  ErrorID: number;
  Submissions: Submission[];
}

export interface Submission {
  ForwardMessageID: number;
  DestinationID: string;
  ErrorID: number;
  UserMessageID: number;
}

export interface FwrdIdInterface {
  id: number;
  fwrdIdValue: string;
}

export interface MessageBodyCheck {
  access_id: string;
  password: string;
  fwIDs: string;
}

export interface ForwardStatuses {
  ErrorID: number;
  Statuses: StatusesType[];
}

export interface StatusesType {
  ForwardMessageID: number;
  IsClosed: boolean;
  State: number;
  StateUTC: string;
  ReferenceNumber: number;
  Transport: string;
  RegionName: string;
}
export interface StatusesTypeWithId {
  ForwardMessageID: number;
  IsClosed: boolean;
  State: number;
  StateUTC: string;
  ReferenceNumber: number;
  Transport: string;
  RegionName: string;
  id: number;
}
