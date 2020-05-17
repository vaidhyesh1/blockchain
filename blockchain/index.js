const Block = require('./block');
class BlockChain{

    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock(data){
        const localBlock = Block.mineBlock(this.chain[this.chain.length-1],data);
        this.chain.push(localBlock);
        return localBlock;
    }
    isValidChain(chain){
        if(JSON.stringify(chain[0]) != JSON.stringify(Block.genesis())){
            return false;
        }
        for(let i=1 ; i<chain.length; i++){
            const curBlock = chain[i];
            const prevBlock = chain[i-1];
            if(curBlock.lastHash != prevBlock.hash || curBlock.hash != Block.blockHash(curBlock)){
                return false;
            }
        }
        return true;
    }
    replaceChain(newChain){
        if(newChain.length<=this.chain.length){
            console.log('Chain is not longer than current chain');
            return;
        }
        else if(!this.isValidChain(newChain)){
            console.log('Chain provided is invalid chain');
            return;
        }
        console.log('Replacing the chain');
        this.chain=newChain;

    }
}

module.exports = BlockChain;