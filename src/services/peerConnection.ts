import Peer, { Instance, SignalData } from "simple-peer";
import { Socket } from "socket.io-client";
import { IPayload, IPeers } from "../../types";

interface Props {
  roomId: string;
  socketRef: React.MutableRefObject<Socket>;
  peersRef: React.MutableRefObject<IPeers[]>;
  userVideo: React.MutableRefObject<HTMLVideoElement>;
  setTotalPeers: React.Dispatch<React.SetStateAction<IPeers[]>>;
}

const connectToPeer = ({ roomId, socketRef, peersRef, userVideo, setTotalPeers }: Props): void => {
  navigator.mediaDevices
    .getUserMedia({ video: { height: window.innerHeight / 2, width: window.innerWidth / 2 }, audio: true })
    .then(stream => {
      // console.log(stream.getVideoTracks()[0].enabled);
      userVideo.current.srcObject = stream;

      socketRef.current.emit("join room", roomId);

      socketRef.current.on("all users", (users: string[]) => {
        const peers: IPeers[] = [];
        users.forEach((userID: string) => {
          const peer = createPeer(userID, socketRef.current.id, stream);
          peersRef.current.push({
            peerID: userID,
            peer
          });
          peers.push({ peer, peerID: userID });
        });
        // console.log("check 1", peers);
        setTotalPeers(peers);
      });

      socketRef.current.on("user joined", (payload: IPayload) => {
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({
          peerID: payload.callerID,
          peer
        });
        const peerObj = {
          peer,
          peerID: payload.callerID
        };
        // console.log("peer added", peersRef);
        setTotalPeers((users: IPeers[]): IPeers[] => {
          if (!users.find((user: IPeers) => user.peerID === peerObj.peerID)) return [...users, peerObj];
          return [...users];
        });
      });

      socketRef.current.on("receiving returned signal", (payload: IPayload) => {
        const item = peersRef.current.find((p: IPeers) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });

      socketRef.current.on("user left", (id: string) => {
        const peerObj = peersRef.current.find((p: IPeers) => p.peerID === id);
        peerObj?.peer.destroy();
        // console.log("disconnected user ", peerObj);
        const peers = peersRef.current.filter((p: IPeers) => p.peerID !== id);
        peersRef.current = peers;
        // console.log("remaining peer", peers);
        setTotalPeers(peers);
      });
    });

  const createPeer = (userToSignal: string, callerID: string, stream: MediaStream): Instance => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on("signal", signal => {
      socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
    });

    return peer;
  };

  function addPeer(incomingSignal: SignalData, callerID: string, stream: MediaStream): Instance {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on("signal", signal => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }
};

export default connectToPeer;
