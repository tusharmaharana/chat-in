import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import connectToPeer from "../services/peerConnection";
import VideoPlayer from "./VideoPlayer";

const VideoGrid: React.FC = () => {
  const socket = io("http://localhost:5000", {
    autoConnect: false
  });
  const { roomId } = useParams();
  const [totalPeers, setTotalPeers] = useState([]);
  const socketRef = useRef(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef([]);

  useEffect(() => {
    socketRef.current = socket.connect();
    connectToPeer(roomId, socketRef, peersRef, userVideo, setTotalPeers);
  }, []);

  return <VideoPlayer userVideo={userVideo} totalPeers={totalPeers} />;
};

export default VideoGrid;
