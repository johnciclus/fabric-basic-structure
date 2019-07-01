'use strict';

let stringsObjects = require('../helpers/stringsObjects');

let schema = {
    id:           'string',
    name:         'string',
    address:      'string',
    score:        'number'
};

let format = {
    id:           'required',
    name:         'required',
    address:      'required',
    score:        'required|notString'
};

module.exports = {
    schema: schema,
    format: format,
    rules: stringsObjects.mergeObjects(schema, format)
};
