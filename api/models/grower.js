'use strict';

let stringsObjects = require('../helpers/stringsObjects');

let schema = {
    address:      'string',
    firstName:    'string',
    id:           'string',
    lastName:     'string',
    score:        'number'
};

let format = {
    address:      'required',
    firstName:    'required',
    id:           'required',
    lastName:     'required',
    score:        'required|notString'
};

module.exports = {
    schema: schema,
    format: format,
    rules: stringsObjects.mergeObjects(schema, format)
};
