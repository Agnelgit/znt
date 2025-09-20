require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function main() {
  const { Web3Storage } = await import('web3.storage');
  const key = process.env.WEB3STORAGE_API_KEY;
  if (!key) {
    console.error('WEB3STORAGE_API_KEY not set in .env. Create one at https://web3.storage and set it in .env');
    process.exit(1);
  }

  const client = new Web3Storage({ token: key });
  const deploymentsPath = path.join(__dirname, '..', 'deployments', 'hardhat.json');
  if (!fs.existsSync(deploymentsPath)) {
    console.error('deployments/hardhat.json not found — run local deploy first (npm run deploy:local)');
    process.exit(1);
  }

  const file = fs.readFileSync(deploymentsPath);
  const blob = new Blob([file]);
  const cid = await client.put([new File([blob], 'hardhat.json')], { wrapWithDirectory: false });
  console.log('Uploaded deployments/hardhat.json to IPFS with CID:', cid);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
