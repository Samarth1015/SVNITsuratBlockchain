"use client";
import React, { useEffect, useState } from "react";
import { parseQuery } from "./ExtraFuncation_Jenil/Read_Condition_based";
import Sideelement from "./component/Sideelement";

const ChatGPTInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  //function to handle send
  const handleSend = async () => {
    const uri = "mongodb://localhost:27017/";
    const data = {
      paragraph: input,
    };
    setLoading(true);
    const res = await fetch("http://192.168.1.14:5000/getIntent", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setLoading(false);
    const response = await res.json();
    const dbName = ("" + response["DB_info"]).split(/[\s,]+/)[0];
    const colName = response["DB_info"].split(/[\s,]+/)[1];
    let intent = ("" + response.intent).toLowerCase();
    if (intent === "read") {
      console.log("In Read All Data Mode!!");

      const QueryDone = await fetch('/api/ReadAllData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nameOfDB: dbName,
          nameOfCollection: colName,
          MongoDbUri: uri,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))  // Log the response data
        .catch((error) => console.error('Error:', error));

      
    } else if (intent == "CREATE".toLowerCase()) {
      console.log("In Create Mode!");
 

      const QueryDone = await fetch('/api/createdb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nameOfDB: dbName,
          nameOfCollection: colName,
          dataInArray: [{"parmar": "jenil"}],  // Example data to insert
          MongoDbUri: uri,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))  // Log the response data
        .catch((error) => console.error('Error:', error));
    } else if (intent == "UPDATE".toLowerCase()) {
    } else if (intent == "DELETE".toLowerCase()) {
    } else if (intent == "DELETE_CONDITIONED_BASED".toLowerCase()) {
    } else if (intent == "READ_CONDITION_BASED_DATA".toLowerCase()) {
      console.log("IN Read condition data");

      // give me the data whose name hogaya and age is <=19 from database name jenil and collection name pamrar
      const filter = parseQuery(input);

      const QueryDone = await fetch("/api/ReadConditionBased", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameOfDB: dbName,
          nameOfCollection: colName,
          atrs: filter, // Query conditions
          MongoDbUri: uri,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    } else {
      //insert
    }
  };

  useEffect(() => {
    console.log(loading ? "loading" : "done");
  }, [loading]);

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}>
      <div>
        <Sideelement></Sideelement>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}>
            <div
              className={`max-w-xs p-3 rounded-lg text-sm ${
                msg.sender === "user"
                  ? isDarkMode
                    ? "bg-blue-500 text-white"
                    : "bg-blue-500 text-white"
                  : isDarkMode
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              }`}>
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
        }`}>
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
            onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatGPTInterface;
