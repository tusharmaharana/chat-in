import React, { ReactElement, useState } from "react";
import { useNavigate } from "react-router";
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
    <div>
      <button type="button" onClick={handleCreateClick}>
        Create room
      </button>
      <form>
        <input
          placeholder="Enter a code or link"
          value={value}
          onChange={(event): void => setValue(event.target.value)}
        />
        <button type="submit" onClick={(event): void => handleJoinClick(event)}>
          Join
        </button>
      </form>
    </div>
  );
};

export default CreateRoom;
