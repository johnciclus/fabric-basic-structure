'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Gateway, FileSystemWallet } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const {validations } = require('indicative');
const crypto = require('crypto');
const multer = require('multer');
const rimraf = require('rimraf');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

const port = 3000;
const ccpPath = path.resolve(__dirname, 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
const credentialsPath = path.join(process.cwd(), 'wallet');

let sessions = {};

const creditor = require('./routes/creditor')(sessions);
const creditGuarantee = require('./routes/creditGuarantee')(sessions);
const creditOperation = require('./routes/creditOperation')(sessions);
const channelID = 'mychannel';
const contracts = ['registry'];

app.use(bodyParser.json());
app.use(cors());

validations.notString = require('./validators/notStringFn');

async function registerCredentials(files) {
    return new Promise(function(resolve, reject){
        const userCredentials = files.filter(file => file.originalname.indexOf('-') === -1);
        const userName = userCredentials[0].originalname;
        const userPath = credentialsPath+'/'+userName;
        fs.stat(userPath, function(err, stats) {
            //Check if error defined and the error code is "not exists"
            if (stats) {
                console.log(`Deleting ${userPath}`);
                rimraf.sync(userPath);
            } else if (err && err.errno === 34) {
                //Create the directory, call the callback.
                console.log('An error happens');
                console.log(err);
            }
            fs.mkdir(userPath, () => {
                console.log(`Copying files to: ${userPath}`);
                files.forEach(function(file){
                    fs.createReadStream('./uploads/'+file.filename).pipe(fs.createWriteStream(userPath+'/'+file.originalname));
                });
                fs.readFile(userPath+'/'+userName, function read(err, data) {
                    if (err) {
                        throw err;
                    }
                    const hash = crypto.createHash('md5').update(data.toString()).digest('hex');
                    resolve({status: 'Credentials registered', hash: hash, userName: userName});
                });
            });
        });
    });
}

async function connectWithGateway(userName) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: { enabled: false } });
        return gateway;
    } catch (error) {
        console.error(`Failed to during the connection with the gateway: ${error}`);
        process.exit(1);
    }
}

async function getNetwork(gateway, channelID) {
    return new Promise(function(resolve, reject) {
        // Get the network (channel) our contract is deployed to.
        gateway.getNetwork(channelID).then(network =>{
            // Get the contract from the network.
            resolve(network);
        }).catch((error)=>{
            console.log('error');
            console.log(error);
            reject(error);
        });
    });
}

app.post('/api/registerCredentials',  upload.array('credentials'), function(req, res){
    // const credentialsName = req.params.id;
    return registerCredentials(req.files).then((status)=>{
        return connectWithGateway(status.userName).then((gateway)=>{
            getNetwork(gateway, channelID).then((network)=> {
                let contractsReferences = contracts.map(contractID => { return {
                    id: contractID,
                    contract: network.getContract(contractID)
                };}).reduce(function(obj, item){ obj[item.id] = item.contract; return obj; }, {});

                sessions[status.hash] = {gateway: gateway, network: network, contracts: contractsReferences};
                return res.send(status);
            });
        });
    });
});

app.get('/api/creditor/', creditor.findAll);

app.get('/api/creditor/:id', creditor.find);

app.post('/api/creditor/', creditor.create);

app.post('/api/creditor/:id', creditor.update);

app.delete('/api/creditor/:id', creditor.delete);

app.get('/api/creditGuarantee/', creditGuarantee.findAll);

app.get('/api/creditGuarantee/:id', creditGuarantee.find);

app.post('/api/creditGuarantee/', creditGuarantee.create);

app.post('/api/creditGuarantee/:id', creditGuarantee.update);

app.delete('/api/creditGuarantee/:id', creditGuarantee.delete);

app.get('/api/creditOperation/', creditOperation.findAll);

app.get('/api/creditOperation/:id', creditOperation.find);

app.post('/api/creditOperation/', creditOperation.create);

app.post('/api/creditOperation/:id', creditOperation.update);

app.delete('/api/creditOperation/:id', creditOperation.delete);

app.get('/api/history/:classname/:id', function(req, res){
    let hash = req.get('hash');
    if (hash in sessions) {
        if (!req.params.id) {
            res.send('An identifier is mandatory');
        } else if (!req.params.classname) {
            res.send('A className is mandatory');
        }
        const className = req.params.classname;

        sessions[hash].contracts[className.toLowerCase()].evaluateTransaction('getHistory', req.params.id.toString()).then( result => {
            let data = JSON.parse(result);
            res.send(JSON.parse(data));
        }).catch((errors)=>{
            res.send(errors);
        });
    } else {
        res.status(400);
        res.send('The session doesn\'t exist');
    }
});

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
