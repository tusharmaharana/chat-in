import styled from "@emotion/styled";
import React, { ReactElement, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Input } from "semantic-ui-react";
import { v4 as uuidV4 } from "uuid";

const CreateRoom = (): ReactElement => {
  const [value, setValue] = useState<string>(undefined);
  // setMounted(true);
  const navigate = useNavigate();

  const handleCreateClick = (): void => {
    const id = uuidV4();
    navigate(`/${id}`);
  };

  const handleJoinClick = (event: React.MouseEvent): void => {
    event.preventDefault();
    navigate(`/${value}`);
  };

  return (
    <Container>
      <Button content="Create a new Room" onClick={handleCreateClick} primary />
      <Input type="text" placeholder="Enter Room Code" onChange={(event): void => setValue(event.target.value)}>
        <input />
        <Button disabled={!value} content="Join" onClick={(event): void => handleJoinClick(event)} />
      </Input>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export default CreateRoom;
