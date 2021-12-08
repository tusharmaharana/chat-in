import styled from "@emotion/styled";
import React, { ReactElement, useEffect, useRef } from "react";
import { Instance } from "simple-peer";
import { IPeers } from "../../types";

interface Props {
  userVideo: React.MutableRefObject<HTMLVideoElement>;
  totalPeers: IPeers[];
}

interface VideoProps {
  peer: Instance;
  size: string;
}

const Video = (props: VideoProps): ReactElement => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    props?.peer.on("stream", (stream: MediaStream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <StyledDiv videoWidth={props.size}>
      <StyledVideo playsInline autoPlay ref={ref}>
        <track kind="captions" />
      </StyledVideo>
    </StyledDiv>
  );
};

const renderVideoSize = (count: number): string => {
  const rem: number = 90 / count;
  if (rem === 90) return "90%";
  if (rem >= 22 && rem < 90) return "44%";
  return "32%";
};

const VideoPlayer: React.FC<Props> = (props: Props) => {
  const { userVideo, totalPeers } = props;
  const count: number = (totalPeers?.length ?? 0) + 1;
  const size: string = renderVideoSize(count);
  return (
    <Container>
      <StyledDiv videoWidth={size}>
        <StyledVideo muted ref={userVideo} autoPlay playsInline />
      </StyledDiv>
      {totalPeers.map((peer: IPeers) => {
        return <Video key={peer.peerID} peer={peer.peer} size={size} />;
      })}
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0.7rem;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const StyledVideo = styled.video`
  width: 100%;
`;

const StyledDiv = styled.div`
  width: ${(props: { videoWidth: string }): string => props.videoWidth};
  margin: 0.4rem 0.5rem 0.1rem 0.5rem;
  overflow: hidden;
`;

export default VideoPlayer;
