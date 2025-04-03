这是一个通过 pump.fun 区块链合约发行 Meme 币并实现同一板块买入的自动化工具。该项目旨在简化 Meme 币的创建和初始购买流程，通过智能合约打包操作，让用户能够快速部署并启动自己的 Meme 币项目。本仓库已包含所有依赖库（node_modules），无需额外安装依赖即可运行。
项目功能

Meme 币发行：基于 pump.fun 的区块链合约，快速部署自定义的 Meme 币。

自动买入：支持在发行后立即以指定金额买入，简化操作流程。

参数化配置：通过简单的参数设置（如私钥、代币名称、符号、URI 和买入金额），实现灵活的定制化。

技术栈
语言：TypeScript
运行环境：Node.js
依赖：所有依赖已打包在 node_modules 文件夹中。

使用方法
前置条件
确保已安装 Node.js
无需运行 npm install，因为依赖已包含在仓库中。

配置
在 example.ts 文件中，修改以下参数：
deployerPrivatekey: 你的钱包私钥（请妥善保管，勿泄露）。

tokenName: 代币名称，例如 "Vine2.0"。

tokenSymbol: 代币符号，例如 "Vine2.0"。

tokenUri: 代币元数据的 IPFS URI。

buyAmount: 初始买入金额（单位与注释中的换算表对应，例如 40000 = 16U）。

注意：pump社交信息和图像必须用ipfs！  在YUAN.JSON中修改

运行
编译 TypeScript 文件：
npx tsc

执行程序：

node example.js

