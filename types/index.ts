import Peer, { Instance } from "simple-peer";

export interface IPeers {
  peerID: string;
  peer: Instance;
}

export interface IPayload {
  signal: Peer.SignalData;
  callerID: string;
  stream: MediaStream;
  id?: string;
}
