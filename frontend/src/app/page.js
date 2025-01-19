"use client";
import { provider, connectWallet } from "../../utils/connectchain";
import { useEffect, useState } from "react";
import ABI from "../../../artifacts/contracts/Lock.sol/Lock.json";
import { Contract } from "ethers";

export default function Home() {
  useEffect(() => {
    let connect = async () => {
      await connectWallet();
      try {
        let signature = await provider.getSigner();

        let contract = new Contract(
          "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
          ABI.abi,
          signature
        );
        await contract.addPermission(
          "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        );
        await contract.viewAll("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
      } catch (err) {
        console.error("error here ---->", err);
      }
    };
    connect();
  }, []);

  return (
    <div>
      (
      <div>
        <p>Connected Address: </p>
        <button>Disconnect Wallet</button>
      </div>
      )
    </div>
  );
}
