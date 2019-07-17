'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
let schema = {
    id: 'number',
    name: 'string',
    productivity: 'number',
    area: 'number',
    city: 'string',
    state: 'string',
};
let format = {
    id: 'required|notString',
    name: 'required',
    productivity: 'required|notString',
    area: 'required|notString',
    city: 'required',
    state: 'required'
};
exports.default = {
    schema: schema,
    format: format,
    rules: utils_1.default.mergeObjects(schema, format)
};
//# sourceMappingURL=schema.js.map