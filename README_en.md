# pumptoken-buy 🚀

**A Tool to Launch Meme Coins and Bundle Purchases via [pump.fun](https://pump.fun) Blockchain Contracts**  
This is an automated tool designed to simplify the creation and initial purchase of Meme coins. By bundling operations through smart contracts, users can quickly deploy and kickstart their Meme coin projects. This repository includes all dependencies (`node_modules`), ready to use out of the box!

---

## ✨ Key Features

- **Meme Coin Launch**: Quickly deploy custom tokens using pump.fun contracts.
- **Automated Purchase**: Instantly buy a specified amount after issuance—faster than bots! Token creation and purchase are executed in the same block. If creation succeeds but the purchase fails, the blockchain refunds all transaction fees.
- **Flexible Configuration**: Customize token name, symbol, URI, and purchase amount.

## 🛠 Tech Stack

- **Language**: TypeScript  
- **Runtime**: Node.js  
- **Dependencies**: Pre-packaged in `node_modules`, no additional installation required.

---

## 📦 How to Use

### Configuration
1. **Open `example.ts`**:
   - Use any text editor (e.g., VS Code, Notepad++) to open the `example.ts` file in the project root directory.

2. **Modify the Parameters**:
   - `deployerPrivatekey`: Your wallet private key for deployment and transactions.
   - `tokenName`: Set the token name, e.g., "Vine2.0".
   - `tokenSymbol`: Set the token symbol, e.g., "Vine2.0".
   - `tokenUri`: The IPFS URI for token metadata, e.g.:
     ```
     https://purple-peaceful-marmot-693.mypinata.cloud/ipfs/bafkreierxd5evxb6hgbwilia5dbwq4zatyqtb7e4qbbfebkylu4lujvvwm
     ```
   - `buyAmount`: Set the initial purchase amount (integer), refer to the conversion table below.

   **Note**: Since pump.fun tokens fetch images and social info from IPFS, you need to upload your metadata to IPFS first and then use the resulting IPFS URL. Edit the metadata in `YUAN.json`!

## Running the Program
1. **Compile the Program**:
   In the terminal, run:
   ```
   npx tsc
   ```
2.**Execute the Program**
   ```
   node example.js
   ```

## Notes

*Funds:* Ensure your wallet has sufficient funds to cover Gas fees and the purchase amount.

*IPFS Setup:* Upload your token metadata (image, social info) to IPFS and update the tokenUri accordingly. Modify YUAN.json for metadata details.

## Contact

## For any questions, reach out via Telegram: @useusege






   
