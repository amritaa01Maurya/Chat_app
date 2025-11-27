import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check for existing session
    const savedToken = localStorage.getItem("token");
    const savedName = localStorage.getItem("username");
    if (savedToken) {
      setToken(savedToken);
      setUsername(savedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername("");
  };

  return (
    <div>
      {!token ? (
        <Login setToken={setToken} setUsername={setUsername} />
      ) : (
        <Chat token={token} username={username} handleLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;