import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { io, Socket } from "socket.io-client";
import { IPeers } from "../../types";
import connectToPeer from "../services/peerConnection";
import RoomFooter from "./RoomFooter";
import VideoPlayer from "./VideoPlayer";

const Room: React.FC = () => {
  const { roomId } = useParams<string>();
  const [totalPeers, setTotalPeers] = useState<IPeers[]>([]);
  const socketRef = useRef<Socket>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<IPeers[]>([]);

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_IO_SERVER);
    connectToPeer({ roomId, socketRef, peersRef, userVideo, setTotalPeers });
  }, []);

  // console.log(peersRef);
  // console.log(totalPeers);

  return (
    <StyledContainer>
      <VideoPlayer userVideo={userVideo} totalPeers={totalPeers} />
      <RoomFooter userVideo={userVideo} socketRef={socketRef} />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export default Room;
