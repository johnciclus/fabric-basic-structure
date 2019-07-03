'use strict';

const className = 'CreditOperation#';
const { validateAll } = require('indicative');
const creditOperationModel = require('../../models/creditOperation');
const crypto = require('crypto');

async function create(contract, creditOperation) {
    return new Promise(function(resolve, reject){
        validateAll(creditOperation, creditOperationModel.rules).then(() => {
            const hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');

            creditOperation.id = className+hash;
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
        id = className+id;

        contract.evaluateTransaction('findCreditOperation', id).then( result => {
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
        id = className+id;

        contract.submitTransaction('updateCreditOperation', id, stringProperties).then( result => {
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
        contract.submitTransaction('deleteCreditOperation', id).then( result => {
            resolve(result);
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

module.exports = function(contract) {
    return {
        create : function(req, res){
            create(contract, req.body).then((result) => {
                res.send({status: 'Credit Operation created', details: result});
            }).catch( error => {
                res.status(400);
                res.send(error);
            });
        },
        find : function(req, res){
            find(contract, req.params.id).then((creditOperation) => {
                let creditOperationObj = JSON.parse(creditOperation);
                res.send(creditOperationObj);
            }).catch( error => {
                res.status(400);
                res.send(error);
            });
        },
        findAll : function(req, res){
            findAll(contract).then((creditOperations) => {
                let creditOperationsObj = JSON.parse(creditOperations);
                res.send(creditOperationsObj);
            });
        },
        update: function(req, res){
            update(contract, req.params.id, req.body).then((result) => {
                res.send('transaction submitted');
            }).catch( error => {
                res.status(400);
                res.send(error);
            });
        },
        delete: function(req, res){
            deleteById(contract, req.params.id).then((result) => {
                res.send('transaction submitted');
            }).catch( error => {
                res.status(400);
                res.send(error);
            });
        }
    };
};
