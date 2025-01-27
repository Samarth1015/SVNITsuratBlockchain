"use client";
import React, { useEffect, useState } from "react";
import { parseQuery } from "./ExtraFuncation_Jenil/Read_Condition_based";
import Sideelement from "./component/Sideelement";
import { contractAddress, provider } from "../utils/connectchain";
import { Contract } from "ethers";
import ABI from "../../artifacts/contracts/Lock.sol/Lock.json";
import { ExtractDataFromPara } from "@/app/api/InsertData/ExtractDataFromInsert";
const uri = "mongodb://localhost:27017/";

const ChatGPTInterface = () => {
  let [add, setAdd] = useState("");
  const [messages, setMessages] = useState(() => []);
  const [input, setInput] = useState("");
  const [allDatabases, setAllDatabase] = useState([]);
  const [anotherData, setAnotherData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [readDataOperation, setReadDataOperation] = useState({
    response: [],
    flag: false,
  });
  const [hydrated, setHydrated] = useState(false);
  const [generalOperation, setGeneralOpeeration] = useState({
    response: "",
    flag: false,
  });
  useEffect(() => {
    async function getDbs(uri) {
      const data = {
        MongoDbUri: uri,
      };

      try {
        const res = await fetch("/api/CheckDb", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch databases");
        }

        const responseData = await res.json();
        console.log("Response Data:", responseData); // Log the response to debug
        const databases = responseData["databases"];
        setAllDatabase(databases["databases"]);
      } catch (error) {
        console.error("Error fetching databases:", error);
      }
    }

    // Replace with your MongoDB URI
    getDbs(uri);
  }, []);
  useEffect(() => {
    setHydrated(true);
  }, []);

  //function to handle send
  const handleSend = async () => {
    // setMessages(input)
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
      setReadDataOperation(true);
      const QueryDone = await fetch("/api/ReadAllData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameOfDB: dbName,
          nameOfCollection: colName,
          MongoDbUri: uri,
        }),
      });
      // .then((response) => response.json())
      // .then((data) => console.log(data))  // Log the response data
      // .catch((error) => console.error('Error:', error));

      const data = await QueryDone.json();
      setReadDataOperation({
        response: data.data, // Assuming the response contains a "data" key
        flag: true,
      });
    } else if (intent == "CREATE".toLowerCase()) {
      console.log("In Create Mode!");

      const QueryDone = await fetch("/api/createdb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameOfDB: dbName,
          nameOfCollection: colName,
          dataInArray: [{ parmar: "jenil" }], // Example data to insert
          MongoDbUri: uri,
        }),
      });
      const data = await QueryDone.json();
      setGeneralOpeeration({
        flag: true,
        response: "Done Creation Operation!!",
      });

      // .then((response) => response.json())
      // .then((data) => console.log(data))  // Log the response data
      // .catch((error) => console.error('Error:', error));
    } else if (intent == "UPDATE".toLowerCase()) {
      console.log("In Update Mode!!!!");
      const filter = parseQuery(input);
      const QueryDone = await fetch("/api/Update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameOfDB: dbName,
          nameOfCollection: colName,
          atrs: filter,
          MongoDbUri: uri,
          changeAtrs: [{ name: "jenil" }, { age: 20 }],
        }),
      });
      const data = await QueryDone.json();
      setGeneralOpeeration({
        flag: true,
        response: data["message"],
      });
    } else if (intent == "DELETE".toLowerCase()) {
      console.log("In Whole Collection Delete Mode!");

      const QueryDone = await fetch("/api/DeleteCollection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameOfDB: dbName,
          nameOfCollection: colName,
          MongoDbUri: uri,
        }),
      });
      const data = await QueryDone.json();
      setGeneralOpeeration({
        flag: true,
        response: data["message"],
      });
      let signature = await provider.getSigner();
      console.log(signature);
      console.log("address->", await signature.getAddress());
      let contract = new Contract(contractAddress, ABI.abi, signature);
      console.log(contract);
      await contract.uploadByOur(
        input,
        `${data["message"]} entries Inseted In DB!!`,
        "update"
      );
    } else if (intent == "DELETE_CONDITIONED_BASED".toLowerCase()) {
      console.log("In Delete Condition based!!!");
      // give me the data whose name hogaya and age is <=19 from database name jenil and collection name pamrar
      const filter = parseQuery(input);

      const QueryDone = await fetch("/api/DeleteConditionBased", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameOfDB: dbName,
          nameOfCollection: colName,
          atrs: filter,
          MongoDbUri: uri,
        }),
      });
      const data = await QueryDone.json();
      setGeneralOpeeration({
        response: `${data["deletedCount"]} entries deleted!!`,
        flag: true,
      });
      let signature = await provider.getSigner();
      console.log(signature);
      console.log("address->", await signature.getAddress());
      let contract = new Contract(contractAddress, ABI.abi, signature);
      console.log(contract);
      await contract.uploadByOur(
        input,
        `${data["message"]} entries Inseted In DB!!`,
        "delete"
      );
    } else if (intent == "READ_CONDITION_BASED_DATA".toLowerCase()) {
      console.log("IN Read condition data");

      // Extract filter conditions from the input
      const filter = parseQuery(input);

      try {
        const res = await fetch("/api/ReadConditionBased", {
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
        });

        // Await the JSON response
        const data = await res.json();
        // console.log(data);
        //
        // Set the response data to state
        setReadDataOperation({
          response: data.data, // Assuming the response contains a "data" key
          flag: true,
        });

        // For debugging the API response
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("In Insert Data Mode!!!");
      const dataToInsert = ExtractDataFromPara(input);
      const QueryDone = await fetch("/api/InsertData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameOfDB: dbName,
          nameOfColletion: colName,
          data: dataToInsert, // Query conditions
          MongodbUri: uri,
        }),
      });
      const data = await QueryDone.json();
      setGeneralOpeeration({
        response: `${data["insertedCount"]} entries Inseted In DB!!`,
        flag: true,
      });
      console.log(
        "----->",

        `${data["insertedCount"]} entries Inseted In DB!!`
      );
      let signature = await provider.getSigner();
      console.log(signature);
      console.log("address->", await signature.getAddress());
      let contract = new Contract(contractAddress, ABI.abi, signature);
      console.log(contract);
      await contract.uploadByOur(
        input,
        `${data["insertedCount"]} entries Inseted In DB!!`,
        "insert"
      );
      // await contract.uploadByOur(
      //   input,
      //   `"2 entries Inseted In DB!!"`,
      //   "insert"
      // );
    }
    // let signature = await provider.getSigner();
    // console.log(signature);
    // console.log("address->", await signature.getAddress());
    // let contract = new Contract(contractAddress, ABI.abi, signature);
    // console.log(contract);
    // await contract.uploadByOur(input, "this is my first data");
  };

  useEffect(() => {
    console.log(loading ? "loading" : "done");
  }, [loading]);
  if (!hydrated) return null;

  return (
    <div
      className={`flex flex-row h-screen ${
        isDarkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div>
        <button
          onClick={async () => {
            let signature = await provider.getSigner();
            console.log(signature);
            console.log("address->", await signature.getAddress());
            let contract = new Contract(contractAddress, ABI.abi, signature);
            console.log(contract);
            console.log("hello");
            let res = await contract.uploadByOur(
              "hello",
              "its samarth",
              "insert data here"
            );
          }}
        >
          view
        </button>
        <button
          onClick={async () => {
            let signature = await provider.getSigner();
            console.log(signature);
            console.log("address->", await signature.getAddress());
            let contract = new Contract(contractAddress, ABI.abi, signature);
            console.log(contract);
            let res = await contract.viewUserItsellf();
            console.log(res);
          }}
        >
          {" "}
          history{" "}
        </button>
      </div>
      <div className="w-fit border-r-2 border-[#292929]  px-4">
        <h1 className="font-semibold text-[#e6e0e0] text-center my-5">
          Databases
        </h1>
        <ul className="gap-2 flex flex-col">
          {allDatabases && allDatabases.length > 0 ? (
            allDatabases.map((db, index) => (
              <li
                className="w-full px-5 py-2 text-sm bg-[#292929] rounded-2xl text-center hover:bg-[#626262] hover:scale-105 transition-all duration-100"
                key={index}
              >
                {db["name"]}
              </li>
            ))
          ) : (
            <p>No databases found.</p>
          )}
        </ul>
      </div>
      <div className="w-fit border-r-2 border-[#292929]  px-4">
        <h1 className="font-semibold text-[#e6e0e0] text-center my-5">
          Databases of another
        </h1>
        <ul className="gap-2 flex flex-col">
          {anotherData && anotherData.length > 0 ? (
            anotherData.map((db, index) => (
              <li
                className="w-full px-5 py-2 text-sm bg-[#292929] rounded-2xl text-center hover:bg-[#626262] hover:scale-105 transition-all duration-100"
                key={index}
              >
                {db["name"]}
              </li>
            ))
          ) : (
            <p>No databases found.</p>
          )}
        </ul>
      </div>

      {/* Chat Messages */}
      <div className="w-full h-screen flex flex-col justify-between">
        <div className="flex flex-col items-center space-y-4 p-2">
          <h2 className="text-xl text-center text-white">Connect to MongoDB</h2>
          <input
            type="text"
            placeholder="Enter MongoDB Connection String"
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-[#292929] text-white focus:ring-[#787d81]"
                : "bg-gray-100 text-black focus:ring-blue-400"
            }`}
            onChange={(e) => setAdd(e.target.value)}
          />
          <button
            onClick={async () => {
              try {
                const signature = await provider.getSigner();
                const address = await signature.getAddress();

                console.log("address->", address);

                const contract = new Contract(
                  contractAddress,
                  ABI.abi,
                  signature
                );
                const res = await contract.viewConnectionString(add);
                console.log("Contract Response: ", res);

                // Call the Next.js API to connect to MongoDB
                const response = await fetch("/api/connectDb", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    connectionString: res, // String obtained from the contract
                  }),
                });

                const result = await response.json();
                if (response.ok) {
                  console.log("Data from MongoDB:", result.databases);
                  setAnotherData(result.databases);
                } else {
                  console.error("API Error:", result.error);
                }
              } catch (error) {
                console.error("Error:", error.message);
              }
            }}
            className="px-4 py-2 rounded-lg bg-[#787d81] text-white hover:bg-[#787d70]"
          >
            Connect
          </button>
        </div>
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
            <>
              <p className="text-white">{generalOperation.response}</p>
            </>
          )}
          {loading && (
            <>
              <p className="animate-pulse duration-150 self-center text-center text-4xl">
                UnderStanding The Query.. 🙂
              </p>
            </>
          )}
        </div>

        {/* Input Field */}
        <div
          className={`p-4 border-t ${
            isDarkMode ? "border-[#292929] " : "border-gray-300 bg-white"
          }`}
        >
          <div className="flex items-center space-x-3 p-2">
            <input
              type="text"
              className={`flex-1  px-4 py-10 rounded-lg focus:outline-none focus:ring-2 ${
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
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-[#787d81] text-white hover:bg-[#787d70]"
                  : "bg-[#787d81] text-white hover:bg-[#787d70]"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent unexpected default actions
                  handleSend();
                }
              }}
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
