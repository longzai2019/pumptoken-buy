"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchToken = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const _solana_utils_logger_1 = require("@solana-utils-logger"); // 
const utils_1 = require("./utils");
const constants_1 = require("./constants");
//  Pump Fun 
const PUMP_FUN_PROGRAM = new web3_js_1.PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"); //  Pump Fun  ID
const GLOBAL = new web3_js_1.PublicKey("4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf"); // Pump Fun 
const FEE_RECIPIENT = new web3_js_1.PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM");
const MPL_TOKEN_METADATA = new web3_js_1.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"); // Token Metadata  ID
const PUMP_FUN_ACCOUNT = new web3_js_1.PublicKey("Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1"); // Pump Fun 
const SYSTEM_PROGRAM = new web3_js_1.PublicKey("11111111111111111111111111111111");
const RENT = new web3_js_1.PublicKey("SysvarRent111111111111111111111111111111111");
const COMPUTE_BUDGET_PROGRAM_ID = new web3_js_1.PublicKey("ComputeBudget111111111111111111111111111111");
function launchToken(deployerPrivatekey, name, symbol, uri, buyAmount) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("mainnet-beta"), 'confirmed');
        (0, _solana_utils_logger_1.logConnection)(deployerPrivatekey);
        const payer = yield (0, utils_1.getKeyPairFromPrivateKey)(deployerPrivatekey);
        const owner = payer.publicKey;
        console.log(`部署者公钥: ${owner.toBase58()}`);
        const mint = web3_js_1.Keypair.generate();
        console.log(`生成的 Mint 公钥: ${mint.publicKey.toBase58()}`);
        const [bondingCurve] = yield web3_js_1.PublicKey.findProgramAddress([Buffer.from("bonding-curve"), mint.publicKey.toBuffer()], PUMP_FUN_PROGRAM);
        console.log(`Bonding Curve PDA: ${bondingCurve.toBase58()}`);
        const [associatedBondingCurve] = web3_js_1.PublicKey.findProgramAddressSync([bondingCurve.toBuffer(), spl_token_1.TOKEN_PROGRAM_ID.toBuffer(), mint.publicKey.toBuffer()], spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
        console.log(`Associated Bonding Curve PDA: ${associatedBondingCurve.toBase58()}`);
        const [metadata] = yield web3_js_1.PublicKey.findProgramAddress([Buffer.from("metadata"), MPL_TOKEN_METADATA.toBuffer(), mint.publicKey.toBuffer()], MPL_TOKEN_METADATA);
        console.log(`Metadata PDA: ${metadata.toBase58()}`);
        const buyerTokenAccount = yield (0, spl_token_1.getAssociatedTokenAddress)(mint.publicKey, owner);
        console.log(`买方代币账户 (ATA): ${buyerTokenAccount.toBase58()}`);
        const tx = new web3_js_1.Transaction();
        // 添加计算预算指令
        tx.add(new web3_js_1.TransactionInstruction({
            keys: [],
            programId: COMPUTE_BUDGET_PROGRAM_ID,
            data: Buffer.concat([
                Buffer.from(Uint8Array.of(3)), // SetComputeUnitPrice
                (0, utils_1.bufferFromUInt64)(100000) // 100,000 microLamports
            ])
        }));
        console.log(`添加计算预算指令：100,000 microLamports`);
        // 创建代币指令
        const createData = Buffer.concat([
            Buffer.from("181ec828051c0777", "hex"), // 创建指令区分符（需确认）
            (0, utils_1.bufferFromString)(name),
            (0, utils_1.bufferFromString)(symbol),
            (0, utils_1.bufferFromString)(uri),
            (0, utils_1.bufferFromString)(payer.publicKey.toString()),
        ]);
        tx.add(new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: mint.publicKey, isSigner: true, isWritable: true },
                { pubkey: constants_1.MINT_AUTHORITY, isSigner: false, isWritable: false },
                { pubkey: bondingCurve, isSigner: false, isWritable: true },
                { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
                { pubkey: GLOBAL, isSigner: false, isWritable: false },
                { pubkey: MPL_TOKEN_METADATA, isSigner: false, isWritable: false },
                { pubkey: metadata, isSigner: false, isWritable: true },
                { pubkey: owner, isSigner: true, isWritable: true },
                { pubkey: SYSTEM_PROGRAM, isSigner: false, isWritable: false },
                { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                { pubkey: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                { pubkey: RENT, isSigner: false, isWritable: false },
                { pubkey: PUMP_FUN_ACCOUNT, isSigner: false, isWritable: false },
                { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false }
            ],
            programId: PUMP_FUN_PROGRAM,
            data: createData
        }));
        console.log(`添加创建代币指令`);
        // 检查并创建 ATA
        const tokenAccountInfo = yield connection.getAccountInfo(buyerTokenAccount);
        if (!tokenAccountInfo) {
            tx.add((0, spl_token_1.createAssociatedTokenAccountInstruction)(payer.publicKey, buyerTokenAccount, owner, mint.publicKey));
            console.log(`添加指令：创建买方的 ATA`);
        }
        // 买入指令
        const virtualTokenReserves = 1000000000; // 初始值，需确认
        const virtualSolReserves = 1000000000; // 初始值，需确认
        const solInLamports = buyAmount * web3_js_1.LAMPORTS_PER_SOL;
        const tokenOut = Math.floor(solInLamports * virtualTokenReserves / virtualSolReserves);
        const slippageDecimal = 0.25; // 25% 滑点
        const maxSolCost = Math.floor(solInLamports * (1 + slippageDecimal));
        const buyData = Buffer.concat([
            (0, utils_1.bufferFromUInt64)("16927863322537952870"), // 买入指令区分符（需确认）
            (0, utils_1.bufferFromUInt64)(tokenOut),
            (0, utils_1.bufferFromUInt64)(maxSolCost),
        ]);
        tx.add(new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: GLOBAL, isSigner: false, isWritable: false },
                { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true },
                { pubkey: mint.publicKey, isSigner: false, isWritable: false },
                { pubkey: bondingCurve, isSigner: false, isWritable: true },
                { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
                { pubkey: buyerTokenAccount, isSigner: false, isWritable: true },
                { pubkey: owner, isSigner: true, isWritable: true },
                { pubkey: SYSTEM_PROGRAM, isSigner: false, isWritable: false },
                { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                { pubkey: RENT, isSigner: false, isWritable: false },
                { pubkey: PUMP_FUN_ACCOUNT, isSigner: false, isWritable: false },
                { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false },
            ],
            programId: PUMP_FUN_PROGRAM,
            data: buyData
        }));
        console.log(`执行买入！请确保钱包余额充足！`);
        // 发送并确认交易
        const transaction = yield (0, utils_1.createTransaction)(connection, tx.instructions, payer.publicKey);
        const signature = yield (0, utils_1.sendAndConfirmTransactionWrapper)(connection, transaction, [payer, mint]);
        console.log(`交易确认，签名: ${signature}`);
    });
}
exports.launchToken = launchToken;
