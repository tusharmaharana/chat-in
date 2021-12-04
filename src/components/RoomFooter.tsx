import React, { ReactElement, useState } from "react";
import { useNavigate } from "react-router";
import { Socket } from "socket.io-client";

interface Props {
  userVideo: React.MutableRefObject<HTMLVideoElement>;
  socketRef: React.MutableRefObject<Socket>;
}

const RoomFooter: React.FC<Props> = ({ userVideo, socketRef }: Props): ReactElement => {
  const [audioMute, setAudioMute] = useState<boolean>(false);
  const [videoHide, setVideoHide] = useState<boolean>(false);
  const stream = userVideo?.current?.srcObject as MediaStream;
  const navigate = useNavigate();

  // console.log(stream.getTracks());

  const handleAudioClick = (): void => {
    stream.getAudioTracks()[0].enabled = audioMute;
    setAudioMute((prev: boolean) => !prev);
  };

  const handleVideoClick = (): void => {
    stream.getVideoTracks()[0].enabled = videoHide;
    setVideoHide((prev: boolean) => !prev);
  };

  const handleEndClick = (): void => {
    stream.getTracks().forEach(track => track.stop());
    socketRef.current.disconnect();
    navigate("/");
  };

  return (
    <div>
      <button type="button" onClick={handleAudioClick}>
        {audioMute ? "unmute" : "mute"}
      </button>
      <button type="button" onClick={handleVideoClick}>
        {videoHide ? "show video" : "hide video"}
      </button>
      <button type="button" onClick={handleEndClick}>
        end call
      </button>
    </div>
  );
};

export default RoomFooter;
