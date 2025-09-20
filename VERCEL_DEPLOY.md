Deploying to Vercel and pinning artifacts to IPFS

1) Vercel setup
- Create a Vercel project connected to your GitHub repo and deploy the Next.js app.
- Add the following Environment Variables in the Vercel dashboard (Project Settings -> Environment Variables):
  - ARBITRUM_SEPOLIA_RPC (only if you deploy contracts from Vercel CI)
  - DEPLOYER_PRIVATE_KEY (never commit this; set as a secret)
  - WEB3STORAGE_API_KEY (for pinning deployments to IPFS)

2) CI (GitHub Actions)
- The repository includes `.github/workflows/deploy-and-pin.yml` which will run on push to `main`.
- Add the same secrets to your GitHub repository (Settings -> Secrets and variables -> Actions):
  - ARBITRUM_SEPOLIA_RPC
  - DEPLOYER_PRIVATE_KEY
  - WEB3STORAGE_API_KEY

3) Local testing
- Populate `.env` from `.env.example` with your RPC and private key (local only).
- Run `npm run deploy:local` to deploy to the Hardhat network and write `deployments/hardhat.json`.
- Run `npm run pin:deployments` to upload `deployments/hardhat.json` to IPFS (requires WEB3STORAGE_API_KEY).

4) Notes and security
- Do not store private keys in the repo. Use Vercel/GitHub Secrets.
- Consider verifying contracts on a block explorer after deployment (Hardhat has verification plugins).

