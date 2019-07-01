'use strict';

let stringsObjects = require('../helpers/stringsObjects');

let schema = {
    id:              'string',
    state:           'string',
    digitalSignature:'string',
    debtor:          'string',
    creditor:        'string',
    guarantee:       'string'
};

let format = {
    id:              'required',
    state:           'required',
    digitalSignature:'required',
    debtor:          'required',
    creditor:        'required|notString',
    guarantee:       'required'
};

module.exports = {
    schema: schema,
    format: format,
    rules: stringsObjects.mergeObjects(schema, format)
};
