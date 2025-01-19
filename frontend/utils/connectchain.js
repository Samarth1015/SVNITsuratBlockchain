import { Contract, ethers } from "ethers";
import ABI from "../../artifacts/contracts/Lock.sol/Lock.json";

const provider = new ethers.BrowserProvider(window.ethereum);

let contract;
async function connectWallet() {
  try {
    await provider.send("eth_requestAccounts", []);
  } catch (err) {
    console.error("error in connecting wallet");
  }
}

export { provider, connectWallet };
