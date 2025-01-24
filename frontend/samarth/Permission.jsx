"use client";
import { useState } from "react";
import { provider } from "../utils/connectchain";
import { Contract } from "ethers";
import ABI from "../../artifacts/contracts/Lock.sol/Lock.json";

export default function Perm() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const fetchContract = async () => {
    const signer = await provider.getSigner();
    let contract = new Contract(contractAddress, ABI.abi, signer);
    return contract;
  };

  const [address, setAddress] = useState({ address: "", name: "" });
  const [userAllowed, setUserAllowed] = useState([]);

  return (
    <div className="bg-gray-900 h-screen flex">
      {/* Add Permission Section */}
      <div className="w-1/2 flex justify-center items-center">
        <div>
          <input
            className="text-black"
            type="text"
            placeholder="Enter address"
            required
            onChange={(e) =>
              setAddress({ ...address, address: e.target.value })
            }
          />
          <input
            className="text-black"
            type="text"
            placeholder="Enter name"
            required
            onChange={(e) => setAddress({ ...address, name: e.target.value })}
          />
          <br />
          <button
            onClick={async () => {
              let contract = await fetchContract();
              let res = await contract?.addPermission(
                address.address,
                address.name
              );
              if (res) {
                alert("Permission added successfully");
              } else {
                alert("Permission not added");
              }
            }}
          >
            Add Permission
          </button>
        </div>
      </div>

      {/* View Permission Section */}
      <div className="w-1/2 flex justify-center items-center">
        <div>
          <button
            onClick={async () => {
              let contract = await fetchContract();
              let res = await contract.sharedAccessWith();
              console.log(res);
              setUserAllowed(
                res.map((item, index) => ({
                  type: index % 2 === 0 ? "Address" : "Name",
                  value: item.toString(),
                }))
              );
            }}
          >
            View Permission
          </button>
          <div className="mt-4">
            <h3 className="text-white">Allowed Permissions:</h3>
            <ul>
              {userAllowed.length > 0 ? (
                userAllowed.map((item, index) => (
                  <li
                    key={index}
                    className={`text-${
                      item.type === "Address" ? "green" : "blue"
                    }-400`}
                  >
                    {item.type}: {item.value}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No permissions granted yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Remove Permission Section */}
      <div className="flex justify-center flex-col items-center w-1/2">
        <input
          className="text-black block"
          type="text"
          placeholder="Enter address to remove"
          required
          onChange={(e) =>
            setAddress((prev) => ({ ...prev, address: e.target.value }))
          }
        />
        <button
          onClick={async () => {
            let contract = await fetchContract();
            let res = await contract.removeAccess(address.address);
            if (res) {
              alert("Permission removed successfully");
            } else {
              alert("Permission not removed");
            }
          }}
        >
          Remove Permission
        </button>
      </div>
    </div>
  );
}
