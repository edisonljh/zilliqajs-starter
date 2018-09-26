/*
 * DeployContract.js : This script will deploy a script from contract/helloWorld.scilla to the blockchain
 */

require("isomorphic-fetch");
const { Zilliqa } = require("zilliqa-js");
const fs = require("fs");
const BN = require("bn.js");

const config = require('../config');

const url = config.local_url;   // Links to KayaRPC
// const url = config.testnet_url;    // uncomment if using testnet

let zilliqa = new Zilliqa({
    nodeUrl: url
});

const privateKey = config.wallet.privateKey;
const address = zilliqa.util.getAddressFromPrivateKey(privateKey);

const node = zilliqa.getNode();
console.log(`Address: ${address}`);
console.log(`Pubkey:  ${zilliqa.util.getPubKeyFromPrivateKey(privateKey)}`);

function callback(err, data) {
    if (err || data.error) {
        console.log(`Error: ${err}`);
    } else {
        console.log(data);
    }
}

/*  Start of Script */
console.log("Zilliqa Testing Script");
console.log(`Connected to ${url}`);

/* Contract specific Parameters */

const code = fs.readFileSync("../contracts/helloWorld.scilla", "utf-8");
// the immutable initialisation variables

let initParams = [
    {
        vname: "owner",
        type: "ByStr20",
        value: `0x${address}`
    }
];

if (url === config.local_url) {
    // creation block is required for scilla-runner / KayaRPCs
    const initCreationBlock = {
        vname: "_creation_block",
        type: "BNum",
        value: "1"
    }
    initParams.push(initCreationBlock);
}

// transaction details
let txnDetails = {
    version: 0,
    nonce: 1,
    to: "0000000000000000000000000000000000000000",
    amount: new BN(0),
    gasPrice: 1,
    gasLimit: 5000,
    code: code,
    data: JSON.stringify(initParams).replace(/\\"/g, '"')
};

console.log(initParams);
// sign the transaction using util methods
let txn = zilliqa.util.createTransactionJson(privateKey, txnDetails);
console.log(txn);

// // send the transaction to the node
node.createTransaction(txn, callback);