const {INITIAL_BALANCE} = require('../config')
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
class Wallet{
    constructor(){
        this.balance=INITIAL_BALANCE;
        this.keyPair=ChainUtil.genKeyPair();
        this.publicKey=this.keyPair.getPublic().encode('hex');
    }
    toString(){
        return `Wallet:
        Balance   : ${this.balance}
        publicKey : ${this.publicKey.toString()}
        `
    }
    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }
    createTransaction(recipient,amount,blockchain,transactionPool){

        this.balance = this.calculateBalance(blockchain);
        if(amount > this.balance){
            console.log( `The amount ${amount} is greater than balance : ${this.balance}`);
            return;
        }
        let transaction = transactionPool.existingTransaction(this.publicKey);
        if(transaction){
            transaction = transaction.update(this,recipient,amount);
        }
        else{
            transaction = Transaction.newTransaction(this,recipient,amount);
        }
        transactionPool.updateOrAddTransaction(transaction);
        return transaction;
    }
    static blockChainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }

    calculateBalance(blockchain){
        let balance = this.balance;
        let transactions = [];
        blockchain.chain.forEach(block=>{
                block.data.forEach(transaction => {transactions.push(transaction)})
        });
        // Filter out all the transactions where the wallet owner sends cash to someone else
        const walletInputTs = transactions.filter(transaction => transaction.input.address == this.publicKey);
        // Find the latest transaction where the wallet owner was the sender
        let startTime=0;
        if(walletInputTs.length>0){
            const recentInputT = walletInputTs.reduce((prev,current)=> prev.input.timeStamp > current.input.timeStamp ? prev : current); 
            balance = recentInputT.outputs.find(item=> item.address === this.publicKey).amount;
            startTime = recentInputT.input.timeStamp;
        }
        // Add the balances from all the transactions after the wallet owner made the last payment from the transactions where the wallet owner is receiver
        transactions.forEach(transaction=>{
            if(transaction.input.timeStamp > startTime){
                transaction.outputs.find(output=> {
                    if(output.address === this.publicKey){
                        balance += output.amount;
                    }
            })
            }
        });
        return balance;
    }
}

module.exports = Wallet;