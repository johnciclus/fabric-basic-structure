"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
const indicative_1 = require("indicative");
const utils_1 = require("./utils");
const schema_1 = require("./schema");
const validators_1 = require("./validators");
indicative_1.validations.notString = validators_1.default.notString;
class Registry extends fabric_contract_api_1.Contract {
    constructor() {
        super();
    }
    initLedger(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const objects = [];
            for (let i = 0; i < objects.length; i++) {
                objects[i].docType = 'object';
                yield ctx.stub.putState(i.toString(), Buffer.from(JSON.stringify(objects[i])));
                console.info('Added <--> ', objects[i]);
            }
        });
    }
    getHistory(ctx, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('============= START : Get History ===========');
            if (!id) {
                throw new Error('ID is mandatory, it doesn\'t exist');
            }
            let iterator = yield ctx.stub.getHistoryForKey(id);
            const history = [];
            while (true) {
                const item = yield iterator.next();
                if (item.value && item.value.value.toString('utf8')) {
                    let record;
                    try {
                        record = JSON.parse(item.value.value.toString('utf8'));
                    }
                    catch (err) {
                        console.log(err);
                        record = item.value.value.toString();
                    }
                    history.push(record);
                }
                if (item.done) {
                    yield iterator.close();
                    console.info(history);
                    return JSON.stringify(history);
                }
            }
        });
    }
    createRegistry(ctx, id, registry) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('============= START : Create Registry ===========');
            let registryJSON = JSON.parse(registry);
            let filteredJSON = utils_1.default.filterBySchema(schema_1.default.schema, registryJSON);
            try {
                yield indicative_1.validateAll(filteredJSON, schema_1.default.rules);
                filteredJSON['docType'] = 'registry';
                return yield ctx.stub.putState(id, Buffer.from(JSON.stringify(filteredJSON), 'utf8'));
            }
            catch (errors) {
                return errors;
            }
        });
    }
    findRegistry(ctx, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let registryAsBytes;
            try {
                registryAsBytes = yield ctx.stub.getState(id);
            }
            catch (errors) {
                throw new Error(`An error happened when it was call getState method with id ${id}`);
            }
            if (!registryAsBytes || registryAsBytes.length === 0) {
                throw new Error(`Registry ${id} doesn\'t exist`);
            }
            let registry = JSON.parse(registryAsBytes.toString());
            let filteredRegistry = utils_1.default.filterBySchema(schema_1.default.schema, registry);
            return JSON.stringify(filteredRegistry);
        });
    }
    findRegistries(ctx, startKey, endKey, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const { iterator } = yield ctx.stub.getStateByRangeWithPagination(startKey, endKey, Number.parseInt(pagination));
            const allResults = [];
            while (true) {
                const res = yield iterator.next();
                if (res.value && res.value.value.toString()) {
                    let record;
                    try {
                        record = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch (err) {
                        console.log(err);
                        record = res.value.value.toString();
                    }
                    allResults.push(utils_1.default.filterBySchema(schema_1.default.schema, record));
                }
                if (res.done) {
                    yield iterator.close();
                    console.info(allResults);
                    return JSON.stringify(allResults);
                }
            }
        });
    }
    updateRegistry(ctx, id, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('============= START : update ===========');
            let propertiesObj = JSON.parse(properties);
            let propertiesFiltered = utils_1.default.filterBySchema(schema_1.default.schema, propertiesObj);
            const objectAsBytes = yield ctx.stub.getState(id);
            if (!objectAsBytes || objectAsBytes.length === 0) {
                throw new Error(`${id} doesn\'t exist`);
            }
            const object = JSON.parse(objectAsBytes.toString());
            Object.keys(propertiesFiltered).map(function (key) {
                object[key] = propertiesFiltered[key];
            });
            console.info('============= END : update ===========');
            return yield ctx.stub.putState(id, Buffer.from(JSON.stringify(object), 'utf8'));
        });
    }
    deleteRegistry(ctx, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('============= START : delete ===========');
            return yield ctx.stub.deleteState(id);
        });
    }
}
exports.Registry = Registry;
//# sourceMappingURL=registry.js.map