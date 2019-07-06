'use strict';

const creditorModel = require('../../models/creditor');
const { validateAll } = require('indicative');
const contractID = 'creditor';

async function create(contract, creditor) {
    return new Promise(function(resolve, reject){
        validateAll(creditor, creditorModel.rules).then(() => {
            //creditor.id = className+creditor.id;
            creditor.id = creditor.id.toString();
            contract.submitTransaction('createCreditor', creditor.id, JSON.stringify(creditor)).then( result => {
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
        contract.evaluateTransaction('findCreditor', id.toString()).then( result => {
            resolve(JSON.parse(result));
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function findAll(contract) {
    return new Promise(function(resolve, reject){
        contract.evaluateTransaction('findCreditors').then( result => {
            resolve(JSON.parse(result));
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function update(contract, id, properties) {
    return new Promise(function(resolve, reject){
        let stringProperties = JSON.stringify(properties);
        contract.submitTransaction('updateCreditor', id.toString(), stringProperties).then( result => {
            resolve(result);
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function deleteById(contract, id) {
    return new Promise(function(resolve, reject){
        // Evaluate the specified transaction.
        contract.submitTransaction('deleteCreditor', id.toString()).then( result => {
            resolve(result);
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

module.exports = function(sessions) {
    return {
        create : function(req, res){
            const hash = req.get('hash');
            if (hash in sessions) {
                const contract = sessions[hash].contracts[contractID];
                if (contract) {
                    create(contract, req.body).then((result) => {
                        res.send({status: 'Creditor created', details: result});
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
            const hash = req.get('hash');
            if (hash in sessions) {
                const contract = sessions[hash].contracts[contractID];
                if (contract) {
                    find(contract, req.params.id).then((creditor) => {
                        let creditorObj = JSON.parse(creditor);
                        res.send(creditorObj);
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
            const hash = req.get('hash');
            if (hash in sessions) {
                const contract = sessions[hash].contracts[contractID];
                if (contract) {
                    findAll(contract).then((creditors) => {
                        let creditorsObj = JSON.parse(creditors);
                        res.send(creditorsObj);
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
        update: function(req, res){
            const hash = req.get('hash');
            if (hash in sessions) {
                const contract = sessions[hash].contracts[contractID];
                if (contract) {
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
            const hash = req.get('hash');
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
