import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

function makeAccountsFromEnv(key?: string): string[] | undefined {
  if (!key) return undefined;
  const trimmed = key.trim();
  // accept 0x-prefixed or raw 64 hex chars
  if (/^0x[0-9a-fA-F]{64}$/.test(trimmed)) return [trimmed];
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) return ["0x" + trimmed];
  return undefined;
}

const arbAccounts = makeAccountsFromEnv(process.env.DEPLOYER_PRIVATE_KEY);

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.19" }],
  },
  networks: {
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC || "https://arbitrum-sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: arbAccounts,
    },
    hardhat: {},
  },
};

export default config;
