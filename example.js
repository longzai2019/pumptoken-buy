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
const launch_1 = require("./src/launch");
class Example {
    constructor(deployerPrivatekey, tokenUri, tokenSymbol, tokenName, buyAmount) {
        this.deployerPrivatekey = deployerPrivatekey;
        this.tokenUri = tokenUri;
        this.tokenSymbol = tokenSymbol;
        this.tokenName = tokenName;
        this.buyAmount = buyAmount;
    }
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, launch_1.launchToken)(this.deployerPrivatekey, this.tokenName, this.tokenSymbol, this.tokenUri, this.buyAmount);
            }
            catch (error) {
                console.error('主函数错误:', error);
            }
        });
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
