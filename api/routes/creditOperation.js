'use strict';

const creditOperationModel = require('../../models/creditOperation');
const { validateAll } = require('indicative');
const contractID = 'creditguarantee';
const crypto = require('crypto');

async function create(contract, creditOperation) {
    return new Promise(function(resolve, reject){
        validateAll(creditOperation, creditOperationModel.rules).then(() => {
            creditOperation.id = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
            creditOperation.digitalSignature = crypto.createHash('md5').update(JSON.stringify(creditOperation)).digest('hex');

            contract.submitTransaction('createCreditOperation', creditOperation.id, JSON.stringify(creditOperation)).then( result => {
                resolve(JSON.parse(result));
            }).catch((errors)=>{
                reject(errors);
            });
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function find(contract, id) {
    return new Promise(function(resolve, reject){
        if (!id) {
            reject('An identifier is mandatory');
        }

        contract.evaluateTransaction('findCreditOperation', id.toString()).then( result => {
            resolve(JSON.parse(result));
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function findAll(contract) {
    return new Promise(function(resolve, reject){
        contract.evaluateTransaction('findCreditOperations').then( result => {
            resolve(JSON.parse(result));
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function update(contract, id, properties) {
    return new Promise(function(resolve, reject){
        let stringProperties = JSON.stringify(properties);

        contract.submitTransaction('updateCreditOperation', id.toString(), stringProperties).then( result => {
            resolve(result);
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function deleteById(contract, id) {
    return new Promise(function(resolve, reject){
        // Evaluate the specified transaction.
        contract.submitTransaction('deleteCreditOperation', id.toString()).then( result => {
            resolve(result);
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

module.exports = function(sessions) {
    return {
        create : function(req, res){
            let hash = req.get('hash');
            if (hash in sessions) {
                const contract = sessions[hash].contracts[contractID];
                if (contract){
                    create(contract, req.body).then((result) => {
                        res.send({status: 'Credit Operation created', details: result});
                    }).catch( error => {
                        res.status(400);
                        res.send(error);
                    });
                } else {
                    res.status(400);
                    res.send('The contract doesn\'t exist');
                }
            } else {
                res.status(400);
                res.send('The session doesn\'t exist');
            }
        },
        find : function(req, res){
            let hash = req.get('hash');
            if (hash in sessions) {
                const contract = sessions[hash].contracts[contractID];
                if (contract){
                    find(contract, req.params.id).then((creditOperation) => {
                        let creditOperationObj = JSON.parse(creditOperation);
                        res.send(creditOperationObj);
                    }).catch( error => {
                        res.status(400);
                        res.send(error);
                    });
                } else {
                    res.status(400);
                    res.send('The contract doesn\'t exist');
                }
            } else {
                res.status(400);
                res.send('The session doesn\'t exist');
            }
        },
        findAll : function(req, res){
            let hash = req.get('hash');
            if (hash in sessions) {
                const contract = sessions[hash].contracts[contractID];
                if (contract){
                    findAll(contract).then((creditOperations) => {
                        let creditOperationsObj = JSON.parse(creditOperations);
                        res.send(creditOperationsObj);
                    });
                } else {
                    res.status(400);
                    res.send('The contract doesn\'t exist');
                }
            } else {
                res.status(400);
                res.send('The session doesn\'t exist');
            }
        },
        update: function(req, res){
            let hash = req.get('hash');
            if (hash in sessions) {
                const contract = sessions[hash].contracts[contractID];
                if (contract){
                    update(contract, req.params.id, req.body).then((result) => {
                        res.send('transaction submitted');
                    }).catch( error => {
                        res.status(400);
                        res.send(error);
                    });
                } else {
                    res.status(400);
                    res.send('The contract doesn\'t exist');
                }
            } else {
                res.status(400);
                res.send('The session doesn\'t exist');
            }
        },
        delete: function(req, res){
            let hash = req.get('hash');
            if (hash in sessions) {
                const contract = sessions[hash].contracts[contractID];
                if (contract) {
                    deleteById(contract, req.params.id).then((result) => {
                        res.send('transaction submitted');
                    }).catch( error => {
                        res.status(400);
                        res.send(error);
                    });
                } else {
                    res.status(400);
                    res.send('The contract doesn\'t exist');
                }
            } else {
                res.status(400);
                res.send('The session doesn\'t exist');
            }
        }
    };
};
