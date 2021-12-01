import React from "react";
import { Route, Routes } from "react-router-dom";
import CreateRoom from "./CreateRoom";
import VideoGrid from "./VideoGrid";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<CreateRoom />} />
      <Route path="/:roomId" element={<VideoGrid />} />
    </Routes>
  );
};

export default App;
