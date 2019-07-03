'use strict';

let stringsObjects = require('./helpers/stringsObjects');

let schema = {
    debtor:          'string',
    creditor:        'string',
    guarantee:       'string'
};

let format = {
    debtor:          'required',
    creditor:        'required',
    guarantee:       'required'
};

module.exports = {
    schema: schema,
    format: format,
    rules: stringsObjects.mergeObjects(schema, format)
};
