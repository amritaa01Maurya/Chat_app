import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

let socket;

function Chat({ username, handleLogout }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const bottomRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    socket = io(API_URL, { 
      transports: ['websocket'] 
    });

    console.log("🔌 Attempting to connect to server...", API_URL);

    socket.on("connect", () => {
      console.log("✅ Connected to server with ID:", socket.id);
    });

    // fetch chat history from backend
    axios.get(`${API_URL}/api/messages/`)
      .then((res) => {
        setChat(res.data); // load previous messages
      })
      .catch((err) => console.log("Error loading history:", err));

    socket.emit("join_room", username);

    socket.on("received_msg", (data) => {
      // console.log("📩 Message received from server:", data);
      setChat((prev) => [...prev, data]);
    });

    return () => socket.disconnect();
  }, [username, API_URL]);

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
    <div className="flex flex-col items-center justify-center h-[100dvh] bg-gray-100 md:p-4">
      <div className="w-full h-full md:max-w-2xl md:h-[85vh] bg-white md:rounded-lg shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Chat: {username}</span>
          </div>
          <button onClick={handleLogout} className="text-sm bg-red-400 px-3 py-1 rounded hover:bg-red-600">
            <span className="hidden md:inline text-sm">Logout</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-5 h-5 md:hidden" // visible on mobile only
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />              
              </svg>
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
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm md:text-base min-w-0"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-600 font-semibold shadow">
              <span className="hidden md:inline">Send</span>
              <span className="md:hidden">➤</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Chat;