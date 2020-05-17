const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction',()=>{
    let transactions, wallet,recipient, amount;
    beforeEach(()=>{
        wallet = new Wallet();
        amount = 50;
        recipient='012aa1';
        newRecipient = '01ea321';
        newAmount = 200;
        transactions=Transaction.newTransaction(wallet,recipient,amount);
    })
    it('output the amount subtracted from wallet balance',()=>{
        expect(transactions.outputs.find(output => output.address == wallet.publicKey).amount).toEqual(wallet.balance - amount);
    });
    it('verifies whether transaction input amount is same as balance',()=>{
        expect(transactions.input.amount).toEqual(wallet.balance);
    });
    it('verifies whether transaction is valid',()=>{
        expect(Transaction.verifyTransaction(transactions)).toBe(true);
    });
    it('verifies whether transaction is not valid',()=>{
        transactions.outputs[0].amount =50000;
        expect(Transaction.verifyTransaction(transactions)).not.toBe(true);
    });
    it('verifies whether transaction is properly updated',()=>{
        transactions.update(wallet,newRecipient,newAmount).amount
        expect(transactions.outputs.find(output=> output.address == wallet.publicKey).amount).toEqual(wallet.balance - amount - newAmount);
    });
})