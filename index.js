var git = require("./secp256k1.js");
const crypto = require('crypto');


let target =     {
        "bits": 64,
        "low": "8000000000000000",
        "hig": "ffffffffffffffff",
        "address": "16jY7qLJnxb7CHZyqBP8qca9d51gAjyXQN"
    };

const bs58 = require('bs58')
const bytes = bs58.decode(target.address)
console.log(bytes.toString('hex'))
// => 003c176e659bea0f29a3e9bf7880c112b1b31b4dc826268187
// 003ee4133d991f52fdf6a25c9834e0745ac74248a441544743


const privateKey = "0000000000000000000000000000000000000000000000000000000000000002";
const publicKey = git.getPublicKey(privateKey, true);
console.log('02\t\t\t'+publicKey)
const privateKey2 = "0000000000000000000000000000000000000000000000000000000000000001";
const publicKey2 = git.getPublicKey(privateKey2, true);
const publicKey3 = git.getPublicKey(privateKey2, false);
console.log('true:\t\t'+publicKey2)
console.log('false:\t\t'+publicKey3)


let po1 = git.Point.BASE;
let po2 = new git.Point(BigInt(1),BigInt(1));
console.log(po1.x.toString(16))
//console.log(po2.x)

//console.log(po1.add(po1).x.toString(16))

let po3 = po1.add(po1).x.toString(16);
po3 = '02'+po3;
console.log('po3\t\t\t'+po3)

// hash160 = 06afd46bcdfd22ef94ac122aa11f241244a37ecc
console.time('sha')
let sha = crypto.createHash('sha256').update(Buffer.from(po3, 'hex')).digest('hex');
console.timeEnd('sha')
console.time('hash160')
let hash160 = crypto.createHash('ripemd160').update(Buffer.from(sha, 'hex')).digest('hex');
console.timeEnd('hash160')
console.log('hash160:\t'+hash160)






