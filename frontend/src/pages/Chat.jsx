import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

let socket;

function Chat({ username, handleLogout }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("✅ Connected to server with ID:", socket.id);
    });

    socket.emit("join_room", username);

    socket.on("received_msg", (data) => {
      console.log("📩 Message received from server:", data);
      setChat((prev) => [...prev, data]);
    });

    return () => socket.disconnect();
  }, [username]);

  // Auto-scroll logic
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_msg", {
        msg: message,
        username: username,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center text-white">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Live Chat: {username}</span>
          </div>
          <button onClick={handleLogout} className="text-sm bg-red-500 px-3 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
          {chat.map((c, i) => {
            const isMe = c.username === username;
            return (
              <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className={`max-w-[75%] px-4 py-2 rounded-lg shadow-sm break-words ${
                    isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white border text-gray-800 rounded-bl-none"
                  }`}>
                  {!isMe && <span className="block text-xs font-bold text-blue-600 mb-1">{c.username}</span>}
                  <p>{c.msg}</p>
                </div>
                <span className="text-xs text-gray-400 mt-1 mx-1">{c.time}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold shadow">
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Chat;