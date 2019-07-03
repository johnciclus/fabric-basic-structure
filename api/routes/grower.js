'use strict';

const className = 'Grower#';
const { validateAll } = require('indicative');
const growerModel = require('../../models/grower');

// function getCommand() {
//     if (process.argv.length >= 3) {
//         return {action: process.argv[2], params: process.argv.slice(3) };
//     } else {
//         console.log('3 or more arguments are mandatory');
//         process.exit(1);
//     }
// }
//
// const command = getCommand();
//
// switch(command.action) {
//     case 'create':
//         createCreditGuarantee().then(() => {
//             console.log('Transaction has been submitted');
//         });
//         break;
//     case 'find':
//         find(command.params[0]).then((creditGuarantee) => {
//             if (creditGuarantee) {
//                 console.log(`Transaction has been evaluated, result is: ${creditGuarantee.toString()}`);
//             }
//             else {
//                 console.log('Nothing founded');
//             }
//         });
//         break;
//     case 'findAll':
//         findAll().then((creditGuarantees) => {
//             console.log(`Transaction has been evaluated, result is: ${creditGuarantees.toString()}`);
//         });
//         break;
//     case 'update':
//         update(command.params[0], {expirationDate: '12/30/2019'}).then((creditGuarantees) => {
//             console.log('Transaction has been summited');
//         });
//         break;
//     case 'delete':
//         deleteById(command.params[0]).then(() => {
//             console.log('Transaction has been summited');
//         });
//         break;
//     default:
//         console.log(`The action ${command.action} hasn't been found`);
// }

async function create(contract, grower) {
    return new Promise(function(resolve, reject){
        validateAll(grower, growerModel.rules).then(() => {
            grower.id = className+grower.id;
            contract.submitTransaction('createGrower', grower.id, JSON.stringify(grower)).then( result => {
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

        contract.evaluateTransaction('findGrower', id).then( result => {
            resolve(JSON.parse(result));
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function findAll(contract) {
    return new Promise(function(resolve, reject){
        contract.evaluateTransaction('findGrowers').then( result => {
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

        contract.submitTransaction('updateGrower', id, stringProperties).then( result => {
            resolve(result);
        }).catch((errors)=>{
            reject(errors);
        });
    });
}

async function deleteById(contract, id) {
    return new Promise(function(resolve, reject){
        id = className+id;
        // Evaluate the specified transaction.
        contract.submitTransaction('deleteGrower', id).then( result => {
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
                    res.send({status: 'Grower created', details: result});
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
                find(sessions[hash].contract, req.params.id).then((grower) => {
                    let growerObj = JSON.parse(grower);
                    res.send(growerObj);
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
                findAll(sessions[hash].contract).then((growers) => {
                    let growersObj = JSON.parse(growers);
                    res.send(growersObj);
                }).catch( error => {
                    res.status(400);
                    res.send(error);
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
