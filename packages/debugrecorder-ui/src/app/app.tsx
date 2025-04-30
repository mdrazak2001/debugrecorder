// packages/debugrecorder-ui/src/App.tsx
import React from "react";
import SessionPlayer from "../pages/SessionPlayer";
import '../styles.css'; // Make sure to import your CSS file

function App() {
  return (
    <div className="dark-mode">
      <SessionPlayer />
    </div>
  );
}

export default App;


