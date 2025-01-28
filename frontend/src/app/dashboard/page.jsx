"use client";
import { Contract } from "ethers";
import ChatGPTInterface from "../../../samarth/Dash";
import { contractAddress, provider } from "../../../utils/connectchain";
import ABI from "../../../../artifacts/contracts/Lock.sol/Lock.json";

export default function Dashboard() {
  return (
    <>
      <ChatGPTInterface></ChatGPTInterface>
    </>
  );
}
