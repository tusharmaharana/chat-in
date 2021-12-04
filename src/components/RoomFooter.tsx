import React, { ReactElement, useState } from "react";

interface Props {
  userVideo: React.MutableRefObject<HTMLVideoElement>;
}

const RoomFooter: React.FC<Props> = ({ userVideo }: Props): ReactElement => {
  const [audioMute, setAudioMute] = useState<boolean>(false);
  const [videoHide, setVideoHide] = useState<boolean>(false);
  const stream = userVideo?.current?.srcObject as MediaStream;

  // console.log(stream.getVideoTracks()[0]);

  const handleAudioClick = (): void => {
    stream.getAudioTracks()[0].enabled = audioMute;
    setAudioMute((prev: boolean) => !prev);
  };
  const handleVideoClick = (): void => {
    stream.getVideoTracks()[0].enabled = videoHide;
    setVideoHide((prev: boolean) => !prev);
  };

  return (
    <div>
      <button type="button" onClick={handleAudioClick}>
        {audioMute ? "unmute" : "mute"}
      </button>
      <button type="button" onClick={handleVideoClick}>
        {videoHide ? "show video" : "hide video"}
      </button>
    </div>
  );
};

export default RoomFooter;
