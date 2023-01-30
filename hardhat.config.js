require("@nomiclabs/hardhat-waffle");
const fs = require('fs');

const GOERLI_PRIVATE_KEY= fs.readFileSync('.secret').toString().trim();
const ALCHEMY_API_KEY = process.env.API_KEY;

module.exports = {
  networks:{
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/ntdvzlM2nfLiY6Q_K57AMu6Ti2zaNXXU`,
      accounts: ['8ffc50fb10c90f5878d8bd58a17109665f18d6c9085bc6c92426c7dfd89829f6'],
      // gas: 2100000,
      // gasPrice: 8000000000,
      // saveDeployments: true,
    }
    // hardhat:{
    //   // chainId:1337,
      
    // }
  },
  solidity: "0.8.4"
};
