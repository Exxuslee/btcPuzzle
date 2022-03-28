const secp256k1 = require("./secp256k1.js");
const crypto = require('crypto');

let i,j;
console.log("Worker puzzle...\t16jY7qLJnxb7CHZyqBP8qca9d51gAjyXQN");

module.exports.doProcess = function () {
    process.send({type: "newTask"});

    process.on('message', function (msg) {
        if (msg.type==="hit")
        {
            console.log("Worker stop!");
            process.exit()
        }

        if (msg.type==="newTask")
        {
            let pubk = secp256k1.getPublicKey(msg.privk, false);
            let pointX = '';
            let pointY = '';
            let pubk_comrress ='';
            if (parseInt(pubk.substr(128),16) % 2) pubk_comrress = '03'+ pubk.substr(2, 64);
            else pubk_comrress = '02'+ pubk.substr(2, 64);
            for (i=0; i<16777216;i++){
                // console.log('pubk\t\t\t\t'+pubk);
                let sha = crypto.createHash('sha256').update(Buffer.from(pubk_comrress, 'hex')).digest('hex');
                let hash160 = crypto.createHash('ripemd160').update(Buffer.from(sha, 'hex')).digest('hex');
//                console.log('hash160\t\t\t\t'+hash160);
                if (hash160 === '3ee4133d991f52fdf6a25c9834e0745ac74248a4') {
                    console.log("Worker found!", hash160);
                    process.send(
                        {
                            type: "hit",
                            privk: msg.privk,
                            i: i
                        });
                } else {
                    pointX = '0x'+pubk.substr(2, 64);
                    pointY = '0x'+pubk.substr(66);
                    let point = new secp256k1.Point(BigInt(pointX),BigInt(pointY));
                    point = point.add(secp256k1.Point.BASE);
                    // console.log('pointX\t\t\t\t'+point.x.toString(16));
                    // console.log('pointY\t\t\t\t'+point.y.toString(16));
                    let newX ='';
                    let newY ='';
                    for (j=point.x.toString(16).length; j<64;j++) newX += '0';
                    for (j=point.y.toString(16).length; j<64;j++) newY += '0';
                    newX += point.x.toString(16);
                    newY += point.y.toString(16);
                    pubk = '04'+ newX + newY;
                    // console.log('pubk\t\t\t\t'+pubk);
                    if (parseInt(pubk.substr(128),16) % 2) pubk_comrress = '03'+ pubk.substr(2, 64);
                    else pubk_comrress = '02'+ pubk.substr(2, 64);
                    // console.log('pubk_comrress\t\t'+pubk_comrress);
                }
            }
            process.send({type: "newTask"});
        }
    });
};

