import React from "react";
import { Route, Routes } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import Landing from "./Landing";
import Room from "./Room";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/:roomId" element={<Room />} />
    </Routes>
  );
};

export default App;
