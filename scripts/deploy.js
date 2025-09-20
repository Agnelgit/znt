require('dotenv').config();
async function main() {
  const hre = require('hardhat');
  const ethers = hre.ethers;

  // Determine deployer signer: use getSigners() on local networks, otherwise build a Wallet from private key
  let deployer;
  if (hre.network.name === 'hardhat' || hre.network.name === 'localhost') {
    const signers = await ethers.getSigners();
    deployer = signers[0];
  } else {
    const pk = process.env.DEPLOYER_PRIVATE_KEY;
    if (!pk) {
      throw new Error('DEPLOYER_PRIVATE_KEY is required for remote deployments');
    }
    // ethers in Hardhat context exposes JsonRpcProvider and Wallet in v6 as ethers.JsonRpcProvider / ethers.Wallet
    const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_SEPOLIA_RPC || hre.network.config.url);
    deployer = new ethers.Wallet(pk, provider);
  }

  console.log('Deploying contracts with account:', deployer.address);

  const ZynqtraBadges = await ethers.getContractFactory('ZynqtraBadges');
  const badges = await ZynqtraBadges.connect(deployer).deploy();
  await badges.waitForDeployment();
  console.log('ZynqtraBadges deployed to:', badges.target);

  const ZynqtraProfile = await ethers.getContractFactory('ZynqtraProfile');
  const profile = await ZynqtraProfile.connect(deployer).deploy();
  await profile.waitForDeployment();
  console.log('ZynqtraProfile deployed to:', profile.target);

  const ZynqtraEvents = await ethers.getContractFactory('ZynqtraEvents');
  const events = await ZynqtraEvents.connect(deployer).deploy();
  await events.waitForDeployment();
  console.log('ZynqtraEvents deployed to:', events.target);

  // Save deployment artifacts
  const fs = require('fs');
  const path = require('path');
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir, { recursive: true });

  function parseAbi(i) {
    const formatted = i.format('json');
    if (typeof formatted === 'string') {
      try {
        return JSON.parse(formatted);
      } catch (e) {
        // sometimes format returns a string that is actually a JSON array joined by commas
        return formatted;
      }
    }
    return formatted;
  }

  const out = {
    network: 'hardhat',
    deployer: deployer.address,
    deployments: {
      ZynqtraBadges: { address: badges.target, abi: parseAbi(badges.interface) },
      ZynqtraProfile: { address: profile.target, abi: parseAbi(profile.interface) },
      ZynqtraEvents: { address: events.target, abi: parseAbi(events.interface) },
    },
  };

  fs.writeFileSync(path.join(deploymentsDir, 'hardhat.json'), JSON.stringify(out, null, 2));
  console.log('Saved deployment artifacts to deployments/hardhat.json');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
