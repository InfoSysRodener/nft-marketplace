require("@nomiclabs/hardhat-waffle");
const fs = require('fs');

const GOERLI_PRIVATE_KEY= fs.readFileSync('.secret').toString().trim();
const ALCHEMY_API_KEY = process.env.REACT_APP_API_KEY;

module.exports = {
  networks:{
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  },
  solidity: "0.8.4"
};
