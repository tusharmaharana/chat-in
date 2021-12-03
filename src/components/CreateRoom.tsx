import React, { ReactElement } from "react";
import { useNavigate } from "react-router";
import { v4 as uuidV4 } from "uuid";

const CreateRoom = (): ReactElement => {
  const navigate = useNavigate();

  const handleClick = (): void => {
    const id = uuidV4();
    navigate(`/${id}`);
  };

  return (
    <button onClick={handleClick} type="button">
      Create room
    </button>
  );
};

export default CreateRoom;
