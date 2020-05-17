const TransactionPool =  require('./transaction-pool');
const Transaction = require('./transaction');
const BlockChain = require('../blockchain');
const Wallet = require('./index');

describe('TransactionPool',()=>{
    let tp,transaction,wallet,bc;
    beforeEach(()=>{
        tp = new TransactionPool();
        wallet = new Wallet();
        bc = new BlockChain();
        transaction = Transaction.newTransaction(wallet,'some-wallet',300);
        tp.updateOrAddTransaction(transaction);
        transaction = wallet.createTransaction('blah',50,bc,tp);
    })
    it('Prove that it adds transaction to pool',()=>{
        expect(tp.transactions.find(t=> t.id == transaction.id)).toEqual(transaction);
    })
    it('updates transaction in the pool',()=>{
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet,'foo-someAdd',40);
        tp.updateOrAddTransaction(newTransaction);
        expect(JSON.stringify(tp.transactions.find(item=> item.id == newTransaction.id))).not.toEqual(JSON.stringify(oldTransaction));

    });
    describe('Mixing valid and corrupt transactions',()=>{
        let validTransactions;
        beforeEach(()=>{
            validTransactions= [...tp.transactions];
            for(let i=0;i<6;i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction('bruh',30,bc,tp);
                if(i%2==0){
                    transaction.input.amount =1000000;
                }
                else
                    validTransactions.push(transaction);
            }
        });
        it('seperates the invalid and valid',()=>{
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        })
        it('grabs valid transactiosn',()=>{
            expect(tp.validTransactions()).toEqual(validTransactions);
        })
    })
})