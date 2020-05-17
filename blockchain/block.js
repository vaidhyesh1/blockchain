const SHA256 = require('crypto-js/sha256')
const {DIFFICULTY,MINE_RATE} = require('../config')
class Block{
    constructor(timeStamp, lastHash, hash, data,nonce,difficulty){
        this.timeStamp = timeStamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty =difficulty || DIFFICULTY;
    }
    toString(){
        return `Block -
        TimeStamp - ${this.timeStamp}
        LastHash  - ${this.lastHash.substring(0,10)}
        Hash      - ${this.hash.substring(0,10)}
        Nonce     - ${this.nonce}
        Difficulty- ${this.difficulty}
        Data      - ${this.data}
        `;
    }

    static genesis(){
        return new this('Dummy date','Dummy','f1rst-h4sh',[],0,DIFFICULTY);
    }

    static mineBlock(lastBlock, data){
        let timeStamp ;
        const lastHash = lastBlock.hash;
        let {difficulty} = lastBlock;
        let localHash;
        let nonce = 0;
        do{
            nonce++;
            timeStamp = Date.now();
            difficulty = Block.adjustDiff(lastBlock,timeStamp);
            localHash = Block.hash(timeStamp,lastHash,data,nonce,difficulty);
        }
        while(localHash.substring(0,difficulty) !== '0'.repeat(difficulty));

        return new Block(timeStamp,lastHash,localHash,data,nonce,difficulty);
    }

    static hash( timeStamp, lastHash, data, nonce,difficulty){
        return SHA256(`${timeStamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }
    static blockHash(block){
        return Block.hash(block.timeStamp,block.lastHash,block.data,block.nonce,block.difficulty);
    }
    static adjustDiff(lastBlock,currentTime){
        let {difficulty} = lastBlock;
        difficulty = lastBlock.timeStamp + MINE_RATE > currentTime ? difficulty+1 : difficulty -1;
        return difficulty;
    }
}

module.exports = Block;