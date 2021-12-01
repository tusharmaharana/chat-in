import React from "react";
import { useNavigate } from "react-router";
import { v4 as uuidV4 } from "uuid";

const CreateRoom = () => {
  const navigate = useNavigate();

  const create = () => {
    const id = uuidV4();
    navigate(`/${id}`);
  };

  return (
    <button onClick={create} type="button">
      Create room
    </button>
  );
};

export default CreateRoom;
