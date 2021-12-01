import Peer from "simple-peer";

const connectToPeer = (roomId: any, socketRef: any, peersRef: any, userVideo: any, setTotalPeers: any): any => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    userVideo.current.srcObject = stream;
    socketRef.current.emit("join room", roomId);
    socketRef.current.on("all users", (users: any) => {
      const peers: any = [];
      users.forEach((userID: any) => {
        const peer = createPeer(userID, socketRef.current.id, stream);
        peersRef.current.push({
          peerID: userID,
          peer
        });
        peers.push({ peer, peerID: userID });
      });
      setTotalPeers(peers);
    });

    socketRef.current.on("user joined", (payload: any) => {
      const peer = addPeer(payload.signal, payload.callerID, stream);
      peersRef.current.push({
        peerID: payload.callerID,
        peer
      });
      const peerObj = {
        peer,
        peerID: payload.callerID
      };

      setTotalPeers((users: any) => [...users, peerObj]);
    });

    socketRef.current.on("receiving returned signal", (payload: any) => {
      const item = peersRef.current.find((p: any) => p.peerID === payload.id);
      item.peer.signal(payload.signal);
    });

    socketRef.current.on("user left", (id: any) => {
      const peerObj = peersRef.current.find((p: any) => p.peerID === id);
      peerObj?.peer.destroy();
      const peers = peersRef.current.filter((p: any) => p.peerID !== id);
      peersRef.current = peers;
      setTotalPeers(peers);
    });
  });

  const createPeer = (userToSignal: any, callerID: any, stream: any): any => {
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

  function addPeer(incomingSignal: any, callerID: any, stream: any): any {
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

  return { userVideo };
};

export default connectToPeer;
