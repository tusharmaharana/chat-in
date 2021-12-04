import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { io, Socket } from "socket.io-client";
import { IPeers } from "../../types";
import connectToPeer from "../services/peerConnection";
import RoomFooter from "./RoomFooter";
import VideoPlayer from "./VideoPlayer";

const VideoGrid: React.FC = () => {
  const { roomId } = useParams<string>();
  const [totalPeers, setTotalPeers] = useState<IPeers[]>([]);
  const socketRef = useRef<Socket>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<IPeers[]>([]);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    connectToPeer({ roomId, socketRef, peersRef, userVideo, setTotalPeers });
  }, []);

  // console.log(peersRef);
  // console.log(totalPeers);

  return (
    <>
      <VideoPlayer userVideo={userVideo} totalPeers={totalPeers} />
      <RoomFooter userVideo={userVideo} socketRef={socketRef} />
    </>
  );
};

export default VideoGrid;
