"use client";
import React, { useState } from "react";

const ChatGPTInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleSend = () => {
    if (input.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input },
      { sender: "bot", text: "This is a bot response!" }, // Add bot response logic here
    ]);
    setInput("");
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Dark Mode Toggle */}
      <div className="p-4 flex justify-end">
        <button
          className={`px-4 py-2 text-sm rounded-lg ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-300 hover:bg-gray-200 text-black"
          }`}
          onClick={() => setIsDarkMode((prev) => !prev)}
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg text-sm ${
                msg.sender === "user"
                  ? isDarkMode
                    ? "bg-blue-500 text-white"
                    : "bg-blue-500 text-white"
                  : isDarkMode
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div
        className={`p-4 border-t ${
          isDarkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-300 bg-white"
        }`}
      >
        <div className="flex items-center space-x-3">
          <input
            type="text"
            className={`flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-gray-700 text-white focus:ring-blue-500"
                : "bg-gray-100 text-black focus:ring-blue-400"
            }`}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className={`px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatGPTInterface;
