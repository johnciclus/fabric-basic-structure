/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Bart extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const objects = [
        ];

        for (let i = 0; i < objects.length; i++) {
            objects[i].docType = 'object';
            await ctx.stub.putState('OBJ' + i, Buffer.from(JSON.stringify(objects[i])));
            console.info('Added <--> ', objects[i]);
        }

        console.info('============= END : Initialize Ledger ===========');
    }

    async createGrower(ctx, id, grower) {
        console.info('============= START : Create Grower ===========');
        let growerJSON = JSON.parse(grower);

        growerJSON.docType = 'grower';

        return await ctx.stub.putState(id, Buffer.from(JSON.stringify(growerJSON),'utf8'));
    }

    async findGrower(ctx, id) {
        const growerAsBytes = await ctx.stub.getState(id);
        if (!growerAsBytes || growerAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        return growerAsBytes.toString();
    }

    async findGrowers(ctx) {
        const startKey = 'G0';
        const endKey = 'G999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                //const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults, 'utf8');
            }
        }
    }

    async updateGrower(ctx, id, properties) {
        console.info('============= START : update ===========');

        let propertiesObj = JSON.parse(properties);

        const objectAsBytes = await ctx.stub.getState(id);
        if (!objectAsBytes || objectAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        const object = JSON.parse(objectAsBytes.toString());

        Object.keys(propertiesObj).map(function (key) {
            object[key] = propertiesObj[key];
        });

        console.info('============= END : update ===========');
        return await ctx.stub.putState(id, Buffer.from(JSON.stringify(object),'utf8'));
    }

    async deleteGrower(ctx, id) {
        console.info('============= START : delete ===========');
        return await ctx.stub.deleteState(id);
    }

    async createCreditGuarantee(ctx, id, creditGuarantee) {
        console.info('============= START : Create Credit Guarantee ===========');
        let creditGuaranteeJSON = JSON.parse(creditGuarantee);

        creditGuaranteeJSON.docType = 'creditGuarantee';

        return await ctx.stub.putState(id, Buffer.from(JSON.stringify(creditGuaranteeJSON),'utf8'));
    }

    async findCreditGuarantee(ctx, id) {
        const creditGuaranteeAsBytes = await ctx.stub.getState(id);
        if (!creditGuaranteeAsBytes || creditGuaranteeAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        return creditGuaranteeAsBytes.toString();
    }

    async findCreditGuarantees(ctx) {
        const startKey = 'CG0';
        const endKey = 'CG999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                //const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults, 'utf8');
            }
        }
    }

    async updateCreditGuarantee(ctx, id, properties) {
        console.info('============= START : update ===========');

        let propertiesObj = JSON.parse(properties);

        const objectAsBytes = await ctx.stub.getState(id);
        if (!objectAsBytes || objectAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        const object = JSON.parse(objectAsBytes.toString());

        Object.keys(propertiesObj).map(function (key) {
            object[key] = propertiesObj[key];
        });

        return await ctx.stub.putState(id, Buffer.from(JSON.stringify(object),'utf8'));
    }

    async deleteCreditGuarantee(ctx, id) {
        console.info('============= START : delete ===========');
        return await ctx.stub.deleteState(id);
    }

    async createCreditor(ctx, id, creditor) {
        console.info('============= START : Create Creditor ===========');
        let creditorJSON = JSON.parse(creditor);

        creditorJSON.docType = 'creditor';

        return await ctx.stub.putState(id, Buffer.from(JSON.stringify(creditorJSON),'utf8'));
    }

    async findCreditor(ctx, id) {
        const creditorAsBytes = await ctx.stub.getState(id);
        if (!creditorAsBytes || creditorAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        return creditorAsBytes.toString();
    }

    async findCreditors(ctx) {
        const startKey = 'C0';
        const endKey = 'C999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                //const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults, 'utf8');
            }
        }
    }

    async updateCreditor(ctx, id, properties) {
        console.info('============= START : update ===========');

        let propertiesObj = JSON.parse(properties);

        const objectAsBytes = await ctx.stub.getState(id);
        if (!objectAsBytes || objectAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        const object = JSON.parse(objectAsBytes.toString());

        Object.keys(propertiesObj).map(function (key) {
            object[key] = propertiesObj[key];
        });

        console.info('============= END : update ===========');
        return await ctx.stub.putState(id, Buffer.from(JSON.stringify(object),'utf8'));
    }

    async deleteCreditor(ctx, id) {
        console.info('============= START : delete ===========');
        return await ctx.stub.deleteState(id);
    }

    async createCreditOperation(ctx, id, creditOperation) {
        console.info('============= START : Create Credit Guarantee ===========');
        let creditOperationJSON = JSON.parse(creditOperation);

        creditOperationJSON.docType = 'creditOperation';

        return await ctx.stub.putState(id, Buffer.from(JSON.stringify(creditOperationJSON),'utf8'));
    }

    async findCreditOperation(ctx, id) {
        const creditOperationAsBytes = await ctx.stub.getState(id);
        if (!creditOperationAsBytes || creditOperationAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        return creditOperationAsBytes.toString();
    }

    async findCreditOperations(ctx) {
        const startKey = 'CO0';
        const endKey = 'CO999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                //const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults, 'utf8');
            }
        }
    }

    async updateCreditOperation(ctx, id, properties) {
        console.info('============= START : update ===========');

        let propertiesObj = JSON.parse(properties);

        const objectAsBytes = await ctx.stub.getState(id);
        if (!objectAsBytes || objectAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        const object = JSON.parse(objectAsBytes.toString());

        Object.keys(propertiesObj).map(function (key) {
            object[key] = propertiesObj[key];
        });

        return await ctx.stub.putState(id, Buffer.from(JSON.stringify(object),'utf8'));
    }

    async deleteCreditOperation(ctx, id) {
        console.info('============= START : delete ===========');
        return await ctx.stub.deleteState(id);
    }
}

module.exports = Bart;
