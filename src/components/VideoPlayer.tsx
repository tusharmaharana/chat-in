import React, { useEffect, useRef } from "react";

const Video = (props: any): any => {
  const ref = useRef(null);

  useEffect(() => {
    props.peer.on("stream", (stream: any) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <video playsInline autoPlay ref={ref} height="300" width="300">
      <track kind="captions" />
    </video>
  );
};

const VideoPlayer: React.FC<any> = (props: any) => {
  const { userVideo, totalPeers } = props;
  return (
    <div>
      <video muted ref={userVideo} autoPlay playsInline height="300" width="300" />
      {totalPeers.map((peer: any) => {
        return <Video key={peer.peerID} peer={peer.peer} />;
      })}
    </div>
  );
};

export default VideoPlayer;
