import React, { ReactElement, useEffect, useRef } from "react";
import { Instance } from "simple-peer";
import { IPeers } from "../../types";

interface Props {
  userVideo: React.MutableRefObject<HTMLVideoElement>;
  totalPeers: IPeers[];
}

interface VideoProps {
  peer: Instance;
}

const Video = (props: VideoProps): ReactElement => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    props?.peer.on("stream", (stream: MediaStream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <video playsInline autoPlay ref={ref} height="300" width="300">
      <track kind="captions" />
    </video>
  );
};

const VideoPlayer: React.FC<Props> = (props: Props) => {
  const { userVideo, totalPeers } = props;
  return (
    <div>
      <video muted ref={userVideo} autoPlay playsInline height="300" width="300" />
      {totalPeers.map((peer: IPeers) => {
        return <Video key={peer.peerID} peer={peer.peer} />;
      })}
    </div>
  );
};

export default VideoPlayer;
