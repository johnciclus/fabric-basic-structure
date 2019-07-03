'use strict';

const className = 'CreditGuarantee#';
const { validateAll } = require('indicative');
const creditGuaranteeModel = require('../../models/creditGuarantee');

async function create(contract, creditGuarantee) {
    return new Promise(function(resolve, reject){
        validateAll(creditGuarantee, creditGuaranteeModel.rules).then(() => {
            creditGuarantee.id = className+creditGuarantee.id;
            contract.submitTransaction('createCreditGuarantee', creditGuarantee.id, JSON.stringify(creditGuarantee)).then( result => {
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
        id = className+id;
        contract.evaluateTransaction('findCreditGuarantee', id).then( result => {
            resolve(JSON.parse(result));
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function findAll(contract) {
    return new Promise(function(resolve, reject){
        contract.evaluateTransaction('findCreditGuarantees').then( result => {
            resolve(JSON.parse(result));
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function update(contract, id, properties) {
    return new Promise(function(resolve, reject){
        let stringProperties = JSON.stringify(properties);
        id = className+id;

        contract.submitTransaction('updateCreditGuarantee', id, stringProperties).then( result => {
            resolve(result);
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function deleteById(contract, id) {
    return new Promise(function(resolve, reject){
        // Evaluate the specified transaction.
        id = className+id;
        contract.submitTransaction('deleteCreditGuarantee', id).then( result => {
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
                create(sessions[hash].contract, req.body).then((result) => {
                    res.send({status: 'Credit Guarantee created', details: result});
                }).catch( error => {
                    res.status(400);
                    res.send(error);
                });
            } else {
                res.status(400);
                res.send('The session doesn\'t exist');
            }
        },
        find : function(req, res){
            let hash = req.get('hash');
            if (hash in sessions) {
                find(sessions[hash].contract, req.params.id).then((creditGuarantee) => {
                    let creditGuaranteeObj = JSON.parse(creditGuarantee);
                    res.send(creditGuaranteeObj);
                }).catch( error => {
                    res.status(400);
                    res.send(error);
                });
            } else {
                res.status(400);
                res.send('The session doesn\'t exist');
            }
        },
        findAll : function(req, res){
            let hash = req.get('hash');
            if (hash in sessions) {
                findAll(sessions[hash].contract).then((creditGuarantees) => {
                    let creditGuaranteesObj = JSON.parse(creditGuarantees);
                    res.send(creditGuaranteesObj);
                });
            } else {
                res.status(400);
                res.send('The session doesn\'t exist');
            }
        },
        update: function(req, res){
            let hash = req.get('hash');
            if (hash in sessions) {
                update(sessions[hash].contract, req.params.id, req.body).then((result) => {
                    res.send('transaction submitted');
                }).catch( error => {
                    res.status(400);
                    res.send(error);
                });
            } else {
                res.status(400);
                res.send('The session doesn\'t exist');
            }
        },
        delete: function(req, res){
            let hash = req.get('hash');
            if (hash in sessions) {
                deleteById(sessions[hash].contract, req.params.id).then((result) => {
                    res.send('transaction submitted');
                }).catch( error => {
                    res.status(400);
                    res.send(error);
                });
            } else {
                res.status(400);
                res.send('The session doesn\'t exist');
            }
        }
    };
};
