import { Contract, Context } from 'fabric-contract-api';
import { validateAll, validations } from 'indicative';
import utils from './utils';
import schema from './schema';
import validators from './validators';

validations.notString = validators.notString;

export class Registry extends Contract {
    constructor() {
        super();
    }

    public async initLedger(ctx) {
        const objects = [
        ];

        for (let i = 0; i < objects.length; i++) {
            objects[i].docType = 'object';
            await ctx.stub.putState(i.toString(), Buffer.from(JSON.stringify(objects[i])));
            console.info('Added <--> ', objects[i]);
        }
    }

    public async getHistory(ctx, id) {
        console.info('============= START : Get History ===========');
        if (!id) {
            throw new Error('ID is mandatory, it doesn\'t exist');
        }

        let iterator = await ctx.stub.getHistoryForKey(id);

        const history = [];
        while (true) {
            const item = await iterator.next();

            if (item.value && item.value.value.toString('utf8')) {
                let record;
                try {
                    record = JSON.parse(item.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    record = item.value.value.toString();
                }
                history.push(record);
            }
            if (item.done) {
                await iterator.close();
                console.info(history);
                return JSON.stringify(history);
            }
        }
    }

    public async createRegistry(ctx, id, registry) {
        console.info('============= START : Create Registry ===========');
        let registryJSON = JSON.parse(registry);
        let filteredJSON = utils.filterBySchema(schema.schema, registryJSON);
        try {
            await validateAll(filteredJSON, schema.rules);
            filteredJSON['docType'] = 'registry';
            return await ctx.stub.putState(id, Buffer.from(JSON.stringify(filteredJSON), 'utf8'));
        } catch (errors) {
            return errors;
        }
    }

    public async findRegistry(ctx, id) {
        let registryAsBytes;

        try {
            registryAsBytes = await ctx.stub.getState(id);
        } catch (errors) {
            throw new Error(`An error happened when it was call getState method with id ${id}`);
        }

        if (!registryAsBytes || registryAsBytes.length === 0) {
            throw new Error(`Registry ${id} doesn\'t exist`);
        }

        let registry = JSON.parse(registryAsBytes.toString());

        let filteredRegistry = utils.filterBySchema(schema.schema, registry);

        return JSON.stringify(filteredRegistry);
    }

    public async findRegistries(ctx, startKey, endKey, pagination) {
        const { iterator } = await ctx.stub.getStateByRangeWithPagination(startKey, endKey, Number.parseInt(pagination));
        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let record;
                try {
                    record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    record = res.value.value.toString();
                }
                allResults.push(utils.filterBySchema(schema.schema, record));
            }
            if (res.done) {
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async updateRegistry(ctx, id, properties) {
        console.info('============= START : update ===========');

        let propertiesObj = JSON.parse(properties);
        let propertiesFiltered = utils.filterBySchema(schema.schema, propertiesObj);

        const objectAsBytes = await ctx.stub.getState(id);
        if (!objectAsBytes || objectAsBytes.length === 0) {
            throw new Error(`${id} doesn\'t exist`);
        }
        const object = JSON.parse(objectAsBytes.toString());

        Object.keys(propertiesFiltered).map(function (key) {
            object[key] = propertiesFiltered[key];
        });

        console.info('============= END : update ===========');
        return await ctx.stub.putState(id, Buffer.from(JSON.stringify(object),'utf8'));
    }

    async deleteRegistry(ctx, id) {
        console.info('============= START : delete ===========');
        return await ctx.stub.deleteState(id);
    }
}