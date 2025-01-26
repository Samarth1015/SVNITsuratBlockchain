"use client";
import React, { useEffect, useState } from "react";
import { parseQuery } from "./ExtraFuncation_Jenil/Read_Condition_based";
import Sideelement from "./component/Sideelement";

const ChatGPTInterface = () => {
  const [messages, setMessages] = useState(()=>[]);
  const [input, setInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [readDataOperation , setReadDataOperation] = useState({response :[] , flag:false})
  const [hydrated, setHydrated] = useState(false);

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
        // .then((response) => response.json())
        // .then((data) => console.log(data))  // Log the response data
        // .catch((error) => console.error('Error:', error));

        const data =await QueryDone.json();
        setReadDataOperation({
          response: data.data, // Assuming the response contains a "data" key
          flag: true,
        });
    
      
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
          changeAtrs:[{"name":"jenil"},{"age":20}]
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
      
    } else if (intent == "DELETE".toLowerCase()) {
      console.log("In Whole Collection Delete Mode!");
    

      const QueryDone = await fetch('/api/DeleteCollection', {
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
       })
         .then((response) => response.json())
         .then((data) => console.log(data))
         .catch((error) => console.error("Error:", error));

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
        }
        else {
     console.log("In Insert Data Mode!!!");
     const QueryDone = await fetch("/api/InsertData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nameOfDB: dbName,
        nameOfColletion: colName,
        data: [{"name":"suraj"}, {"name":"kavit"}], // Query conditions
        MongodbUri: uri,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
    }
  };

  useEffect(() => {
    console.log(loading ? "loading" : "done");
  }, [loading]);
if (!hydrated) return null;

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}>
      <div>
        <Sideelement></Sideelement>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
       
  {!loading && readDataOperation.flag &&
    readDataOperation.response.map((obj, index) => (
      <div
        key={index}
        className="p-4 border rounded-lg bg-gray-800 text-white"
      >
        <pre>{JSON.stringify(obj, null, 2)}</pre>
      </div>
    ))}
    {loading && <>
    <p className="animate-pulse duration-150">Fetching Data...</p>
    </>}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevent unexpected default actions
                handleSend();
              }
            }}
            onClick={handleSend}>

            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatGPTInterface;
