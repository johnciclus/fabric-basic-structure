'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Gateway, FileSystemWallet } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const {validations } = require('indicative');

const app = express();
const port = 3000;
const ccpPath = path.resolve(__dirname, 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

app.use(bodyParser.json());
validations.notString = require('./validators/notStringFn');


async function connectWithGateway() {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
        return gateway;
    } catch (error) {
        console.error(`Failed to during the connection with the gateway: ${error}`);
        process.exit(1);
    }
}

connectWithGateway().then( async function (gateway) {
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');
    // Get the contract from the network.
    const contract = network.getContract('bart');

    const grower = require('./routes/grower')(contract);
    const creditor = require('./routes/creditor')(contract);
    const creditGuarantee = require('./routes/creditGuarantee')(contract);
    const creditOperation = require('./routes/creditOperation')(contract);

    app.get('/api/grower/', grower.findAll);

    app.get('/api/grower/:id', grower.find);

    app.post('/api/grower/', grower.create);

    app.post('/api/grower/:id', grower.update);

    app.delete('/api/grower/:id', grower.delete);

    app.get('/api/creditGuarantee/', creditGuarantee.findAll);

    app.get('/api/creditGuarantee/:id', creditGuarantee.find);

    app.post('/api/creditGuarantee/', creditGuarantee.create);

    app.post('/api/creditGuarantee/:id', creditGuarantee.update);

    app.delete('/api/creditGuarantee/:id', creditGuarantee.delete);

    app.get('/api/creditor/', creditor.findAll);

    app.get('/api/creditor/:id', creditor.find);

    app.post('/api/creditor/', creditor.create);

    app.post('/api/creditor/:id', creditor.update);

    app.delete('/api/creditor/:id', creditor.delete);

    app.get('/api/creditOperation/', creditOperation.findAll);

    app.get('/api/creditOperation/:id', creditOperation.find);

    app.post('/api/creditOperation/', creditOperation.create);

    app.post('/api/creditOperation/:id', creditOperation.update);

    app.delete('/api/creditOperation/:id', creditOperation.delete);

    app.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
    });
}).catch((error) =>{
    console.error(`Failed to connect with Gateway: ${error}`);
    process.exit(1);
});




