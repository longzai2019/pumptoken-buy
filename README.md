# MemeCoinLauncher 🚀

**通过 [pump.fun](https://pump.fun) 区块链合约发行 Meme 币并实现捆绑买入的工具**  
这是一个自动化工具，旨在简化 Meme 币的创建和初始购买流程。通过智能合约打包操作，用户可以快速部署并启动自己的 Meme 币项目。本仓库已包含所有依赖库（`node_modules`），开箱即用！

## ✨ 功能亮点

- **Meme 币发行**：基于 pump.fun 合约，快速部署自定义代币。
- **自动买入**：发行后立即以指定金额买入，省时省力，比机器人还快！创建代币和发行代币是在同一区块操作，如果创建成功买入失败，区块链会返回本次所有交易费用！
- **灵活配置**：支持自定义代币名称、符号、URI 和买入金额。

## 🛠 技术栈

- **语言**：TypeScript  
- **运行环境**：Node.js  
- **依赖**：已打包在 `node_modules` 中，无需额外安装。

---

## 📦 使用方法

### 配置
打开 example.ts：
使用任意文本编辑器（如 VS Code、Notepad++）打开项目根目录下的 example.ts 文件。
修改以下参数：
deployerPrivatekey：你的钱包私钥，用于部署和交易。

tokenName：设置代币名称，例如 "Vine2.0"。

tokenSymbol：设置代币符号，例如 "Vine2.0"。

tokenUri：代币元数据的 IPFS URI，例如：

https://purple-peaceful-marmot-693.mypinata.cloud/ipfs/bafkreierxd5evxb6hgbwilia5dbwq4zatyqtb7e4qbbfebkylu4lujvvwm

buyAmount：设置初始买入金额（整数），参考下方换算表。


### 运行
在终端先编译程序
```bash
npx tsc

执行程序：
```bash
node example.js


## 注意事项
费用：确保钱包有足够资金支付 Gas 和买入金额。




