const BlockChain = require('./index');
const Block = require('./block');
describe('blockchain',()=>{
    let bc,bc2; 
    beforeEach(()=>{
        bc =new BlockChain();
        bc2= new BlockChain();
    })
    it('To start blockchain to start genesis',()=>{
        expect(bc.chain[0]).toEqual(Block.genesis());
    })
    it('add new block',()=>{
        const data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
    })
    it('validates a valid chain',()=>{
        bc2.addBlock('foo');
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    })
    it('invalidates with a corrupt genesis block',()=>{
        bc2.chain[0].data='badData';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    })
    it('invalidates a corrupt chain',()=>{
        bc2.addBlock('foo');
        bc2.chain[1].data='notfoo';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    })
    it('replaces with a valid chain',()=>{
        bc2.addBlock('foo');
        bc.replaceChain(bc2.chain);
        expect(bc.chain.length).toEqual(bc2.chain.length);
    })
    it('does not replace with lesser length',()=>{
        bc2.addBlock('foo');
        bc2.replaceChain(bc.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    })
}); 