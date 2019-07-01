'use strict';

const { validateAll } = require('indicative');
const creditorModel = require('../models/creditor');

async function create(contract, creditor) {
    return new Promise(function(resolve, reject){
        validateAll(creditor, creditorModel.rules).then(() => {
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

        contract.evaluateTransaction('findCreditor', id).then( result => {
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

        contract.submitTransaction('updateCreditor', id, stringProperties).then( result => {
            resolve(result);
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function deleteById(contract, id) {
    return new Promise(function(resolve, reject){
        // Evaluate the specified transaction.
        contract.submitTransaction('deleteCreditor', id).then( result => {
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
                res.send({status: 'Creditor created', details: result});
            }).catch( error => {
                res.status(400);
                res.send(error);
            });
        },
        find : function(req, res){
            find(contract, req.params.id).then((creditor) => {
                let creditorrObj = JSON.parse(creditor);
                res.send(creditorrObj);
            }).catch( error => {
                res.status(400);
                res.send(error);
            });
        },
        findAll : function(req, res){
            findAll(contract).then((creditors) => {
                let creditorsObj = JSON.parse(creditors);
                res.send(creditorsObj);
            }).catch( error => {
                res.status(400);
                res.send(error);
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
