"use client";
import React, { useEffect, useState } from "react";
import { provider } from "../utils/connectchain";
import Card from "./component/card";

const View = () => {
  let [response, setResponse] = useState([
    { userStatement: "m", queryPoint: "hel", time: "5" },
    { userStatement: "m", queryPoint: "hel", time: "5" },
    { userStatement: "m", queryPoint: "hel", time: "5" },
    { userStatement: "m", queryPoint: "hel", time: "5" },
    { userStatement: "m", queryPoint: "hel", time: "5" },
    { userStatement: "m", queryPoint: "hel", time: "5" },
    { userStatement: "m", queryPoint: "hel", time: "5" },
    { userStatement: "m", queryPoint: "hel", time: "5" },
    { userStatement: "m", queryPoint: "hel", time: "5" },
    { userStatement: "m", queryPoint: "hel", time: "5" },
    { userStatement: "m", queryPoint: "hel", time: "5" },
    { userStatement: "m", queryPoint: "hel", time: "5" },
    { userStatement: "m", queryPoint: "hel", time: "5" },
  ]);
  useEffect(() => {
    let fetchHistory = () => {
      provider.send();
    };
    fetchHistory();
  });
  return (
    <div className="bg-gray-900 h-full flex flex-wrap  justify-evenly gap-x-14">
      {response &&
        response.map((res) => {
          return (
            <div className="min-w-52 ">
              <Card
                statement={res.userStatement}
                query={res.queryPoint}
                time={res.time}
              ></Card>
            </div>
          );
        })}
    </div>
  );
};

export default View;
