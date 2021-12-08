import styled from "@emotion/styled";
import React, { ReactElement, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Popup } from "semantic-ui-react";
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
    if (stream) stream.getAudioTracks()[0].enabled = audioMute;
    setAudioMute((prev: boolean) => !prev);
  };

  const handleVideoClick = (): void => {
    if (stream) stream.getVideoTracks()[0].enabled = videoHide;
    setVideoHide((prev: boolean) => !prev);
  };

  const handleEndClick = (): void => {
    stream.getTracks().forEach(track => track.stop());
    socketRef.current.disconnect();
    navigate("/");
  };

  return (
    <Container>
      <Popup
        content={audioMute ? "Turn On Microphone" : "Turn Off Microphone"}
        trigger={
          <Button
            icon={audioMute ? "microphone slash" : "microphone"}
            color={audioMute ? "red" : null}
            circular
            size="large"
            style={{ marginRight: "1rem" }}
            onClick={handleAudioClick}
          />
        }
        position="top center"
      />
      <Popup
        content={videoHide ? "Turn On Camera" : "Turn Off Camera"}
        trigger={
          <Button
            icon={videoHide ? "video slash" : "video"}
            circular
            color={videoHide ? "red" : null}
            size="large"
            style={{ marginRight: "1rem" }}
            onClick={handleVideoClick}
          />
        }
        position="top center"
      />
      <Popup
        content="Leave Call"
        trigger={
          <Button
            icon="call"
            color="red"
            size="large"
            style={{ borderRadius: "2rem", width: "4rem" }}
            onClick={handleEndClick}
          />
        }
        position="top center"
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 1rem 0 1.5rem 0;
`;

export default RoomFooter;
