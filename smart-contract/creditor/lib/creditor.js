/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Creditor extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const objects = [
        ];

        for (let i = 0; i < objects.length; i++) {
            objects[i].docType = 'object';
            await ctx.stub.putState(i.toString(), Buffer.from(JSON.stringify(objects[i])));
            console.info('Added <--> ', objects[i]);
        }

        console.info('============= END : Initialize Ledger ===========');
    }

    async getHistory(ctx, id) {
        console.info('============= START : Get History ===========');
        if (!id) {
            throw new Error('ID is mandatory, it doesn\'t exist');
        }

        let iterator = await ctx.stub.getHistoryForKey(id);

        const history = [];
        while (true) {
            const item = await iterator.next();

            if (item.value && item.value.value.toString('utf8')) {
                //const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(item.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = item.value.value.toString();
                }
                history.push(Record);
            }
            if (item.done) {
                console.log('end of data');
                await iterator.close();
                console.info(history);
                return JSON.stringify(history, 'utf8');
            }
        }
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
        const startKey = '0';
        const endKey = '999';

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
}

module.exports = Creditor;
