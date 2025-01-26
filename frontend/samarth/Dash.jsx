"use client";
import React, { useEffect, useState } from "react";
import { parseQuery } from "./ExtraFuncation_Jenil/Read_Condition_based";
import Sideelement from "./component/Sideelement";
import { contractAddress, provider } from "../utils/connectchain";
import { Contract } from "ethers";
import ABI from "../../artifacts/contracts/Lock.sol/Lock.json";

const ChatGPTInterface = () => {
  const [messages, setMessages] = useState(() => []);
  const [input, setInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [readDataOperation, setReadDataOperation] = useState({
    response: [],
    flag: false,
  });
  const [hydrated, setHydrated] = useState(false);
  const [generalOperation, setGeneralOperation] = useState({
    response: "",
    flag: false,
  });

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleSend = async () => {
    const uri = "mongodb://localhost:27017/";
    const data = { paragraph: input };
    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.14:5000/getIntent", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      const response = await res.json();
      const dbName = response["DB_info"].split(/[\s,]+/)[0];
      const colName = response["DB_info"].split(/[\s,]+/)[1];
      const intent = (response.intent || "").toLowerCase();

      if (intent === "read") {
        console.log("In Read All Data Mode!!");
        const QueryDone = await fetch("/api/ReadAllData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nameOfDB: dbName,
            nameOfCollection: colName,
            MongoDbUri: uri,
          }),
        });
        const data = await QueryDone.json();
        setReadDataOperation({ response: data.data, flag: true });
      } else if (intent === "create") {
        console.log("In Create Mode!");
        const QueryDone = await fetch("/api/createdb", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nameOfDB: dbName,
            nameOfCollection: colName,
            dataInArray: [{ parmar: "jenil" }],
            MongoDbUri: uri,
          }),
        });
        const data = await QueryDone.json();
        setGeneralOperation({
          flag: true,
          response: "Done Creation Operation!!",
        });
      } else if (intent === "update") {
        console.log("In Update Mode!!");
        const filter = parseQuery(input);
        const QueryDone = await fetch("/api/Update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nameOfDB: dbName,
            nameOfCollection: colName,
            atrs: filter,
            MongoDbUri: uri,
            changeAtrs: [{ name: "jenil" }, { age: 20 }],
          }),
        });
        const data = await QueryDone.json();
        setGeneralOperation({ flag: true, response: data["message"] });
      } else if (intent === "delete") {
        console.log("In Whole Collection Delete Mode!");
        const QueryDone = await fetch("/api/DeleteCollection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nameOfDB: dbName,
            nameOfCollection: colName,
            MongoDbUri: uri,
          }),
        });
        const data = await QueryDone.json();
        setGeneralOperation({ flag: true, response: data["message"] });
      } else if (intent === "delete_condition_based") {
        console.log("In Delete Condition Based Mode!");
        const filter = parseQuery(input);
        const QueryDone = await fetch("/api/DeleteConditionBased", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nameOfDB: dbName,
            nameOfCollection: colName,
            atrs: filter,
            MongoDbUri: uri,
          }),
        });
        const data = await QueryDone.json();
        setGeneralOperation({
          response: `${data["deletedCount"]} entries deleted!`,
          flag: true,
        });
      } else if (intent === "read_condition_based_data") {
        console.log("In Read Condition Based Mode!");
        const filter = parseQuery(input);
        const res = await fetch("/api/ReadConditionBased", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nameOfDB: dbName,
            nameOfCollection: colName,
            atrs: filter,
            MongoDbUri: uri,
          }),
        });
        const data = await res.json();
        setReadDataOperation({ response: data.data, flag: true });
      } else {
        console.log("In Insert Data Mode!!");
        const QueryDone = await fetch("/api/InsertData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nameOfDB: dbName,
            nameOfCollection: colName,
            data: [{ name: "suraj" }, { name: "kavit" }],
            MongoDbUri: uri,
          }),
        });
        const data = await QueryDone.json();

        setGeneralOperation({
          response: `${data["insertedCount"]} entries Inserted In DB!!`,
          flag: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
    let signature = await provider.getSigner();
    console.log(signature);
    console.log("address->", await signature.getAddress());
    let contract = new Contract(contractAddress, ABI.abi, signature);
    console.log(contract);
    await contract.uploadByOur(input, "this is my first data");
  };

  if (!hydrated) return null;

  return (
    <div
      className={`flex flex-row h-screen ${
        isDarkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div>
        <Sideelement />
      </div>
      <div className="w-full h-screen flex flex-col justify-between">
        <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 justify-center">
          {!loading &&
            readDataOperation.flag &&
            readDataOperation.response.map((obj, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-[#292929] text-white"
              >
                <pre>{JSON.stringify(obj, null, 2)}</pre>
              </div>
            ))}
          {generalOperation.flag && (
            <p className="text-white">{generalOperation.response}</p>
          )}
          {loading && (
            <p className="animate-pulse duration-150 self-center text-center text-4xl">
              Understanding the Query.. 🙂
            </p>
          )}
        </div>
        <div
          className={`p-4 border-t ${
            isDarkMode ? "border-[#292929]" : "border-gray-300 bg-white"
          }`}
        >
          <div className="flex items-center space-x-3 p-2">
            <input
              type="text"
              className={`flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-[#292929] text-white focus:ring-[#787d81]"
                  : "bg-gray-100 text-black focus:ring-blue-400"
              }`}
              placeholder="Kindly Type Your Query"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="px-4 py-2 rounded-lg bg-[#787d81] text-white hover:bg-[#787d70]"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPTInterface;
