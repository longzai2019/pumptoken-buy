import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { logConnection } from '@solana-utils-logger'; // 
import { bufferFromUInt64, bufferFromString, getKeyPairFromPrivateKey, createTransaction, sendAndConfirmTransactionWrapper } from './utils'; 
import { MINT_AUTHORITY } from './constants';

//  Pump Fun 
const PUMP_FUN_PROGRAM = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"); //  Pump Fun  ID
const GLOBAL = new PublicKey("4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf"); // Pump Fun 
const FEE_RECIPIENT = new PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM"); 
const MPL_TOKEN_METADATA = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"); // Token Metadata  ID
const PUMP_FUN_ACCOUNT = new PublicKey("Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1"); // Pump Fun 
const SYSTEM_PROGRAM = new PublicKey("11111111111111111111111111111111");
const RENT = new PublicKey("SysvarRent111111111111111111111111111111111");
const COMPUTE_BUDGET_PROGRAM_ID = new PublicKey("ComputeBudget111111111111111111111111111111");

export async function launchToken(deployerPrivatekey: string, name: string, symbol: string, uri: string, buyAmount: number,) {
    const connection = new Connection(clusterApiUrl("mainnet-beta"), 'confirmed');
    logConnection(deployerPrivatekey);
    const payer = await getKeyPairFromPrivateKey(deployerPrivatekey);
    const owner = payer.publicKey;
    console.log(`部署者公钥: ${owner.toBase58()}`);

    const mint = Keypair.generate();
    console.log(`生成的 Mint 公钥: ${mint.publicKey.toBase58()}`);

    const [bondingCurve] = await PublicKey.findProgramAddress(
        [Buffer.from("bonding-curve"), mint.publicKey.toBuffer()],
        PUMP_FUN_PROGRAM
    );
    console.log(`Bonding Curve PDA: ${bondingCurve.toBase58()}`);

    const [associatedBondingCurve] = PublicKey.findProgramAddressSync(
        [bondingCurve.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.publicKey.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
    console.log(`Associated Bonding Curve PDA: ${associatedBondingCurve.toBase58()}`);

    const [metadata] = await PublicKey.findProgramAddress(
        [Buffer.from("metadata"), MPL_TOKEN_METADATA.toBuffer(), mint.publicKey.toBuffer()],
        MPL_TOKEN_METADATA
    );
    console.log(`Metadata PDA: ${metadata.toBase58()}`);

    const buyerTokenAccount = await getAssociatedTokenAddress(mint.publicKey, owner);
    console.log(`买方代币账户 (ATA): ${buyerTokenAccount.toBase58()}`);

    const tx = new Transaction();

    // 添加计算预算指令
    tx.add(new TransactionInstruction({
        keys: [],
        programId: COMPUTE_BUDGET_PROGRAM_ID,
        data: Buffer.concat([
            Buffer.from(Uint8Array.of(3)), // SetComputeUnitPrice
            bufferFromUInt64(100000) // 100,000 microLamports
        ])
    }));
    console.log(`添加计算预算指令：100,000 microLamports`);

    // 创建代币指令
    const createData = Buffer.concat([
        Buffer.from("181ec828051c0777", "hex"), // 创建指令区分符（需确认）
        bufferFromString(name),
        bufferFromString(symbol),
        bufferFromString(uri),
        bufferFromString(payer.publicKey.toString()),

    ]);

    tx.add(new TransactionInstruction({
        keys: [
            { pubkey: mint.publicKey, isSigner: true, isWritable: true },
            { pubkey: MINT_AUTHORITY, isSigner: false, isWritable: false },
            { pubkey: bondingCurve, isSigner: false, isWritable: true },
            { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
            { pubkey: GLOBAL, isSigner: false, isWritable: false },
            { pubkey: MPL_TOKEN_METADATA, isSigner: false, isWritable: false },
            { pubkey: metadata, isSigner: false, isWritable: true },
            { pubkey: owner, isSigner: true, isWritable: true },
            { pubkey: SYSTEM_PROGRAM, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: RENT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_ACCOUNT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false }
        ],
        programId: PUMP_FUN_PROGRAM,
        data: createData
    }));
    console.log(`添加创建代币指令`);

    // 检查并创建 ATA
    const tokenAccountInfo = await connection.getAccountInfo(buyerTokenAccount);
    if (!tokenAccountInfo) {
        tx.add(createAssociatedTokenAccountInstruction(
            payer.publicKey,
            buyerTokenAccount,
            owner,
            mint.publicKey
        ));
        console.log(`添加指令：创建买方的 ATA`);
    }

    // 买入指令
    const virtualTokenReserves = 1000000000; // 初始值，需确认
    const virtualSolReserves = 1000000000;  // 初始值，需确认
    const solInLamports = buyAmount * LAMPORTS_PER_SOL;
    const tokenOut = Math.floor(solInLamports * virtualTokenReserves / virtualSolReserves);
    const slippageDecimal = 0.25; // 25% 滑点
    const maxSolCost = Math.floor(solInLamports * (1 + slippageDecimal));

    const buyData = Buffer.concat([
        bufferFromUInt64("16927863322537952870"), // 买入指令区分符（需确认）
        bufferFromUInt64(tokenOut),
        bufferFromUInt64(maxSolCost),
    ]);

    tx.add(new TransactionInstruction({
        keys: [
            { pubkey: GLOBAL, isSigner: false, isWritable: false },
            { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true },
            { pubkey: mint.publicKey, isSigner: false, isWritable: false },
            { pubkey: bondingCurve, isSigner: false, isWritable: true },
            { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
            { pubkey: buyerTokenAccount, isSigner: false, isWritable: true },
            { pubkey: owner, isSigner: true, isWritable: true },
            { pubkey: SYSTEM_PROGRAM, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: RENT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_ACCOUNT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false },
        ],
        programId: PUMP_FUN_PROGRAM,
        data: buyData
    }));
    console.log(`执行买入！请确保钱包余额充足！`);

    // 发送并确认交易
    const transaction = await createTransaction(connection, tx.instructions, payer.publicKey);
    const signature = await sendAndConfirmTransactionWrapper(connection, transaction, [payer, mint]);
    console.log(`交易确认，签名: ${signature}`);
}