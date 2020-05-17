const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const BlockChain = require('../blockchain');
const {INITIAL_BALANCE} = require('../config');
describe('Wallet',()=>{
    let wallet,tp,transaction,bc;
    beforeEach(()=>{
        wallet = new Wallet();
        tp =new TransactionPool();
        bc= new BlockChain();
    })

    describe('create a new transaction',()=>{

        beforeEach(()=>{
            recipient = 'random-recipeint';
            amount = 50;
            transaction = wallet.createTransaction(recipient,amount,bc,tp);
            transaction = wallet.createTransaction(recipient,amount,bc,tp);
        
        });
        it('doubles the amount',()=>{
            expect(transaction.outputs.find(i=> i.address === wallet.publicKey).amount).toEqual(wallet.balance - 2*amount);
        })
    });

    describe('calculating balance',()=>{
        let addBalance , repeatAdd, senderWallet;
        beforeEach(()=>{
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;
            for(let i=0;i<repeatAdd;i++){
                senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
            }
            bc.addBlock(tp.transactions);
        })
        it('calculates balance matching recipient',()=>{
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE+ addBalance*repeatAdd);
        })

        it('calculates balance matching sender',()=>{
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - addBalance*repeatAdd);
        })

    })
})