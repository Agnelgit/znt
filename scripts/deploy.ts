import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const ZynqtraBadges = await ethers.getContractFactory("ZynqtraBadges");
  const badges = await ZynqtraBadges.deploy();
  await badges.deployed();
  console.log("ZynqtraBadges deployed to:", badges.address);

  const ZynqtraProfile = await ethers.getContractFactory("ZynqtraProfile");
  const profile = await ZynqtraProfile.deploy();
  await profile.deployed();
  console.log("ZynqtraProfile deployed to:", profile.address);

  const ZynqtraEvents = await ethers.getContractFactory("ZynqtraEvents");
  const events = await ZynqtraEvents.deploy();
  await events.deployed();
  console.log("ZynqtraEvents deployed to:", events.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
