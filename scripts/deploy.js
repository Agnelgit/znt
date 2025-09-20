require('dotenv').config();
async function main() {
  const hre = require('hardhat');
  const ethers = hre.ethers;

  const [deployer] = await ethers.getSigners();
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
