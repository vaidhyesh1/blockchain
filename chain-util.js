const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256')

const UUID = require('uuid/v1');
const ec = new EC("secp256k1");

class ChainUtil {
    static genKeyPair(){
        return ec.genKeyPair();
    }
    static ID(){
        return UUID();
    }
    static hash(data){
        return SHA256(JSON.stringify(data)).toString();

    }
    static verifySign(publicKey,sign,dataHash){
        return ec.keyFromPublic(publicKey,'hex').verify(dataHash,sign);
    }
}

module.exports = ChainUtil;