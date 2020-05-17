const express = require('express');
const bodyParser = require('body-parser');
const Miner = require('./miner');
const BlockChain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new BlockChain();
const wallet = new Wallet();
const tp= new TransactionPool();
const p2pServer = new P2pServer(bc,tp);
const miner = new Miner(bc,tp,wallet,p2pServer);

app.use(bodyParser.json());

app.get('/listBlocks',(req, res)=>{
    res.json(bc.chain);
});

app.post('/mine',(req,res)=>{
    const block= bc.addBlock(req.body.data);
    p2pServer.syncChains();
    console.log(`The ${block.toString()} was added`);
    res.redirect('/listBlocks');
});

app.get('/transactions',(req,res)=>{
    res.json(tp.transactions);
});

app.get('/balance',(req,res)=>{
    res.json({balance: wallet.balance})
})

app.post('/transact',(req,res)=>{
    const {recipient, amount} = req.body;
    const transaction = wallet.createTransaction(recipient,amount,bc,tp);
    p2pServer.broadCastTransaction(transaction);
    res.redirect('/transactions');
})

app.get('/public-key',(req,res)=>{
    res.json({publickey:wallet.publicKey});
});

app.get('/mine-transactions',(req,res)=>{
    block = miner.mine();
    console.log(`Block ${block.toString()} added to blockchain`);
    res.redirect('/listBlocks');
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));

p2pServer.listen();