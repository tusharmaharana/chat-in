import React from "react";
import { Route, Routes } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import Landing from "./Landing";
import VideoGrid from "./VideoGrid";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<Landing />} />
      <Route path="/:roomId" element={<VideoGrid />} />
    </Routes>
  );
};

export default App;
