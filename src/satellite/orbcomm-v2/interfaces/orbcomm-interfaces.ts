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
