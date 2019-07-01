'use strict';

const { validateAll } = require('indicative');
const creditGuaranteeModel = require('../models/creditGuarantee');

async function create(contract, creditGuarantee) {
    return new Promise(function(resolve, reject){
        validateAll(creditGuarantee, creditGuaranteeModel.rules).then(() => {
            contract.submitTransaction('createGrower', creditGuarantee.id, JSON.stringify(creditGuarantee)).then( result => {
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
        contract.submitTransaction('deleteCreditGuarantee', id).then( result => {
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
                res.send({status: 'Credit Guarantee created', details: result});
            }).catch( error => {
                res.status(400);
                res.send(error);
            });
        },
        find : function(req, res){
            find(contract, req.params.id).then((creditGuarantee) => {
                let creditGuaranteeObj = JSON.parse(creditGuarantee);
                res.send(creditGuaranteeObj);
            }).catch( error => {
                res.status(400);
                res.send(error);
            });
        },
        findAll : function(req, res){
            findAll(contract).then((creditGuarantees) => {
                let creditGuaranteesObj = JSON.parse(creditGuarantees);
                res.send(creditGuaranteesObj);
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
