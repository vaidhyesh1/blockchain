const Block = require('./block');
const {DIFFICULTY} = require('../config');
describe('block',()=>{
    let data , lastBlock, block;
    beforeEach(()=>{
        data = 'foo';
        lastBlock= Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('sets the `data` to match input',()=>{
        expect(block.data).toEqual(data);
    });
    it('sets the `lastHash` to match hash of last block',()=>{
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generates a hash matching difficulty',()=>{
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
    })

})