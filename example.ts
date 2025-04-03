import { launchToken } from './src/launch';

class Example {
    private deployerPrivatekey: string;
    private tokenUri: string;
    private tokenSymbol: string;
    private tokenName: string;
    private buyAmount: number;


    constructor(
        deployerPrivatekey: string,
        tokenUri: string,
        tokenSymbol: string,
        tokenName: string,
        buyAmount: number,) {
        this.deployerPrivatekey = deployerPrivatekey;
        this.tokenUri = tokenUri;
        this.tokenSymbol = tokenSymbol;
        this.tokenName = tokenName;
        this.buyAmount = buyAmount;
    }

    async main() {
        try {
            await launchToken(this.deployerPrivatekey, this.tokenName, this.tokenSymbol, this.tokenUri, this.buyAmount,);
        } catch (error) {
            console.error('主函数错误:', error);
        }
    }
}

// 使用示例
const deployerPrivatekey = ''; // 钱包私钥
const tokenName = 'Vine2.0'; // Name
const tokenSymbol = 'Vine2.0'; // Symbol
const tokenUri = 'https://purple-peaceful-marmot-693.mypinata.cloud/ipfs/bafkreierxd5evxb6hgbwilia5dbwq4zatyqtb7e4qbbfebkylu4lujvvwm'; // ipfs URI
const buyAmount = 40000; //   1000=4U 2000=8U 3000=12U 4000=16U 5000=20U 6000=24U 7000=28U 8000=32U 20000=80u 100000=400U ........



const example = new Example(deployerPrivatekey, tokenUri, tokenSymbol, tokenName, buyAmount);
example.main();