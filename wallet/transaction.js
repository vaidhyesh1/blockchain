const ChainUtil = require('../chain-util');
const {MINING_REWARD} = require('../config');
class Transaction{
    constructor(){
        this.id = ChainUtil.ID();
        this.input = null;
        this.outputs =[];
    }
    static newTransaction(senderWallet,recipient,amount){
        const transaction = new this();
        if(amount > senderWallet.balance){
            console.log(`Amount ${amount} is greater than current balance`);
            return;
        }
        transaction.outputs.push(...[
            {amount: senderWallet.balance - amount , address : senderWallet.publicKey },
            {amount,address:recipient}
        ]);
        transaction.signTransaction(transaction,senderWallet)
        return transaction;

    }
    signTransaction(transaction,senderWallet){
        transaction.input ={
            timeStamp : Date.now(),
            amount : senderWallet.balance,
            address : senderWallet.publicKey,
            signature : senderWallet.sign(ChainUtil.hash(transaction.outputs))
        };
    }
    static verifyTransaction(transaction){
        return ChainUtil.verifySign(transaction.input.address,transaction.input.signature,ChainUtil.hash(transaction.outputs));
    }

    static transactionWithOutputs(senderWallet, outputs){
        const transaction = new this();
        transaction.outputs.push(...outputs);
        transaction.signTransaction(transaction,senderWallet);
        return transaction;
    }
    static rewardTransaction(minerWallet, blockchainWallet){
        return Transaction.transactionWithOutputs(blockchainWallet,[{amount:MINING_REWARD,address: minerWallet.publicKey}]);
    }
    update(senderWallet,recipient,amount){
        const senderOutput= this.outputs.find(transaction => transaction.address == senderWallet.publicKey);
        if(amount > senderOutput.amount){
            console.log('The balance is lesser than amount');
            return;
        }
        senderOutput.amount = senderOutput.amount -amount ;
        this.outputs.push({amount,address:recipient});
        this.signTransaction(this,senderWallet);

        return this;
    }
}

module.exports = Transaction;