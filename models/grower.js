'use strict';

let stringsObjects = require('./helpers/stringsObjects');

let schema = {
    id:           'number',
    address:      'string',
    firstName:    'string',
    lastName:     'string',
    score:        'number'
};

let format = {
    id:           'required',
    address:      'required',
    firstName:    'required',
    lastName:     'required',
    score:        'required|notString'
};

module.exports = {
    schema: schema,
    format: format,
    rules: stringsObjects.mergeObjects(schema, format)
};
