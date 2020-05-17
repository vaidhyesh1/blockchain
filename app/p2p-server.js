const Websocket = require('ws');
const P2P_PORT =  process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(','):[];
const MESSAGE_TYPES={
    chain:'CHAIN',
    transaction:'TRANSACTION',
    clear_transactions:'CLEAR_TRANSACTIONS'
};
class P2pServer{
constructor(blockChain,transactionPool){
    this.blockChain = blockChain;
    this.transactionPool = transactionPool;
    this.sockets= [];
}

    listen(){
        const server =new Websocket.Server({port:P2P_PORT});
        server.on('connection',socket =>this.connectSocket(socket));    
        this.connectToPeers();
    }
    connectToPeers(){
        peers.forEach(peer=>{
            const socket= new Websocket(peer);
            socket.on('open',()=>{
                this.connectSocket(socket);
            })
        })
    }
    connectSocket(socket){
        this.sockets.push(socket);
        console.log('Socket connected');
        this.messageHandler(socket);
        this.sendChain(socket);
    }
    messageHandler(socket){
        socket.on('message',message=>{
            const data = JSON.parse(message);
            if(data.type == MESSAGE_TYPES.chain)
                this.blockChain.replaceChain(data.chain);
            else if(data.type == MESSAGE_TYPES.transaction){
                console.log('Transaction received');
                this.transactionPool.updateOrAddTransaction(data.transaction);
            }
            else if(data.type == MESSAGE_TYPES.clear_transactions ){
                this.transactionPool.clear();
            }
        })
    }
    syncChains(){
        this.sockets.forEach(socket=>{
            this.sendChain(socket);
        })
    }
    sendChain(socket){
        socket.send(JSON.stringify({type:MESSAGE_TYPES.chain ,chain:this.blockChain.chain}));
    }

    broadCastTransaction(transaction){
        this.sockets.forEach(socket=>{
            this.sendTransaction(socket,transaction);
        })
    }

    sendTransaction(socket,transaction){
        socket.send(JSON.stringify({type: MESSAGE_TYPES.transaction, transaction}));
    }
    broadCastClearTransactions(){
        this.sockets.forEach(socket=>{
            socket.send(JSON.stringify({type:MESSAGE_TYPES.clear_transactions}))
        })
    }
}

module.exports = P2pServer;