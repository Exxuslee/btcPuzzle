const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const fs = require('fs');

function time(){
    let x = new Date(Date.now());
    return x.toString();
}

function save(data) {
    fs.writeFile('./key.json', JSON.stringify(data),
        function (err) {
            if (err) {
                console.error('Crap happens');
            }
        }
    );
}

function newTask() {
    // const low = BigInt('0x8000000000000000');
    // const hig = BigInt('0xffffffffffffffff');
    // const all_variable = '140 737 488 355 327';
    // const address = "16jY7qLJnxb7CHZyqBP8qca9d51gAjyXQN";
    // const address2 = '00 3ee4133d991f52fdf6a25c9834e0745ac74248a4 41544743';

    let abc = "fecdba9876543210".split("");
    let token = "000000000000000000000000000000000000000000000000";
    token += abc[Math.floor(Math.random() * 8)];
    for (let i = 49; i < 58; i++) token += abc[Math.floor(Math.random() * abc.length)];
    token += '000000';
    return token; //Will return a 32 bit "hash"

}

if (cluster.isMaster) {
    console.log("Start puzzle...\t\t16jY7qLJnxb7CHZyqBP8qca9d51gAjyXQN");
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    Object.keys(cluster.workers).forEach(function (id) {
        console.log("Worker running with ID : " + cluster.workers[id].process.pid);


        cluster.workers[id].on('message', function(msg){
            if (msg.type==="hit")
            {
                save(msg);
                const mail = require("./mail");
                mail.sendMail(msg);
                cluster.workers[id].send(msg); //Worker stop
            }
            if (msg.type==="newTask")
            {
                msg.privk = newTask();
                cluster.workers[id].send(msg);
                console.log(cluster.workers[id].process.pid + " new task: "+time()+" "+ msg.privk);
            }
        });

    });

    cluster.on('exit', function (worker, code, signal) {
        console.log(' Worker ' + worker.process.pid + ' has died');
    });
} else {
    const worker = require("./worker");
    worker.doProcess();
}


